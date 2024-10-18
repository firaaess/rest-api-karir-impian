import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js'; // Import model User

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        const userId = req.id;

        if (!companyName) {
            return res.status(400).json({
                message: 'Nama perusahaan wajib diisi',
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'Pengguna tidak ditemukan',
                success: false
            });
        }

        if (user.role !== 'business') {
            return res.status(403).json({
                message: 'Hanya pengguna dengan peran business yang dapat mendaftarkan perusahaan.',
                success: false
            });
        }

        const existingCompany = await Company.findOne({ userId });
        if (existingCompany) {
            return res.status(400).json({
                message: 'Pengguna sudah memiliki perusahaan.',
                success: false
            });
        }

        let company = await Company.create({
            name: companyName,
            userId: userId,
            isApproved: false // Menandai bahwa perusahaan belum disetujui
        });

        return res.status(201).json({
            message: 'Daftar perusahaan berhasil, menunggu persetujuan admin.',
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
        company.isApproved = true;
        await company.save();

        return res.status(200).json({
            message: 'Perusahaan berhasil disetujui',
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
            companies = await Company.find({ isApproved: true });
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
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        const userId = req.id; // logged in user id
        const user = await User.findById(userId);

        // Check user role and company approval status
        if (!company || (user.role !== 'administrator' && user.role !== 'business' && !company.isApproved)) {
            return res.status(404).json({
                message: 'Perusahaan tidak ditemukan atau belum disetujui',
                success: false
            });
        }

        return res.status(200).json({
            company,
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

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, logo } = req.body;
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

        // Siapkan data untuk diperbarui
        const updateData = { name, description, website, location, logo };
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

        // Ambil data perusahaan
        const company = await Company.findById(companyId);

        // Cek apakah perusahaan ada dan apakah pengguna adalah pemiliknya
        if (!company || company.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'Anda tidak memiliki izin untuk menghapus perusahaan ini.',
                success: false
            });
        }

        await Company.findByIdAndDelete(companyId);
        return res.status(200).json({
            message: 'Berhasil menghapus perusahaan',
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
