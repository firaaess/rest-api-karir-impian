import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js'; // Import model User
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from '../models/job.model.js';
import { sendNewCompanyNotification } from '../utils/msgEmail.js';

// Function to handle adding a new company
export const addCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        const userId = req.id;

        // Validate the request
        if (!companyName) {
            return res.status(400).json({
                message: 'Nama perusahaan wajib diisi',
                success: false
            });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Pengguna tidak ditemukan',
                success: false
            });
        }

        // Check if the user has the correct role
        if (user.role !== 'business') {
            return res.status(403).json({
                message: 'Hanya pengguna dengan peran business yang dapat mendaftarkan perusahaan.',
                success: false
            });
        }

        // Check if the user already has a company
        const existingCompany = await Company.findOne({ userId });
        if (existingCompany) {
            return res.status(400).json({
                message: 'Pengguna sudah memiliki perusahaan.',
                success: false
            });
        }

        // Create the company with "proses" status
        const company = await Company.create({
            name: companyName,
            userId: userId,
            status: 'proses' // Default status set to "proses"
        });

        // Fetch all administrator emails
        const admins = await User.find({ role: 'administrator' });
        const adminEmails = admins.map(admin => admin.email).filter(email => email);

        if (adminEmails.length > 0) {
            // Call the service to send an email notification to all administrators
            await sendNewCompanyNotification(adminEmails, companyName);
        }

        return res.status(201).json({
            message: 'Perusahaan berhasil ditambahkan dan menunggu persetujuan admin.',
            company,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mendaftar perusahaan',
            success: false
        });
    }
};
export const approveCompany = async (req, res) => {
    try {
        const {status} = req.body
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: 'Perusahaan tidak ditemukan',
                success: false
            });
        }

        // Pastikan pengguna adalah administrator
        const user = await User.findById(req.id);
        if (user.role !== 'administrator') {
            return res.status(403).json({
                message: 'Hanya pengurus yang bisa menyetujui',
                success: false
            });
        }

        // Set perusahaan sebagai disetujui
        if (status === 'diterima'){
            company.isApproved = status.toLowerCase();
            await company.save();
            return res.status(200).json({
                message: 'Perusahaan berhasil disetujui',
                success: true
            });
        }
        company.isApproved = status.toLowerCase();
        await company.save();
        return res.status(200).json({
            message: 'Perusahaan di tolak',
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat menyetujui perusahaan',
            success: false
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const user = await User.findById(userId);

        let companies;

        if (user.role === 'administrator') {
            // Retrieve all companies for administrators
            companies = await Company.find({});
        } else if (user.role === 'business') {
            // Retrieve only the company owned by the logged-in user
            companies = await Company.find({ userId }); // Find companies where userId matches
        } else {
            // Other roles (like candidates) can only see approved companies
            companies = await Company.find({ isApproved: 'diterima' });
        }

        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: 'Perusahaan tidak ditemukan',
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan perusahaan',
            success: false
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id
        const company = await Company.findById(companyId)

        if (!company) {
            return res.status(404).json({
                message: 'Perusahaan tidak di temukan',
                success: false
            })
        }

        return res.status(200).json({
            company,
            success : true
        })
    } catch (error) {
        console.error(error)
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const companyId = req.params.id;
        const userId = req.id;

        // Ambil data perusahaan
        const company = await Company.findById(companyId);

        // Cek apakah perusahaan ada dan apakah pengguna adalah pemiliknya
        if (!company || company.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'Anda tidak memiliki izin untuk memperbarui perusahaan ini.',
                success: false
            });
        }

        let logoUrl = company.logo; // Keep existing logo if not updated
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url; // Update logo URL
        }
        // Siapkan data untuk diperbarui
        const updateData = { name, description, website, location, logo:logoUrl };
        const updatedCompany = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        return res.status(200).json({
            message: 'Update informasi perusahaan berhasil',
            updatedCompany,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui perusahaan',
            success: false
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;
        const user = await User.findById(userId)
        // Ambil data perusahaan
        const company = await Company.findById(companyId);

        // Cek apakah perusahaan ada dan apakah pengguna adalah pemiliknya
        if (!company || company.userId.toString() !== userId && user.role !== 'administrator') {
            return res.status(403).json({
                message: 'Anda tidak memiliki izin untuk menghapus perusahaan ini.',
                success: false
            });
        }

        // Delete all jobs associated with this company
        await Job.deleteMany({ company: companyId });

        // Now delete the company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: 'Perusahaan dan semua pekerjaan terkait berhasil dihapus',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus perusahaan',
            success: false
        });
    }
};

