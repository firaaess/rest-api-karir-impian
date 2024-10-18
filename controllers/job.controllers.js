import {Job} from '../models/job.model.js'
import { Company } from '../models/company.model.js'
import { User } from '../models/user.model.js';
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: 'semua data harus terisi',
                success: false
            });
        }

        const company = await Company.findById(companyId);

        if (!company || company.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'Anda tidak memiliki izin untuk memperbarui perusahaan ini.',
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            isApproved: false,
            company: companyId,
            created_by: userId,
        });

        return res.status(200).json({
            message: 'berhasil menambahkan pekerjaan baru',
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server.',
            success: false
        });
    }
};

export const approveJob = async (req, res) => {
    try {
        const jobId = req.params.id; // Ubah untuk menerima jobId
        const job = await Job.findById(jobId).populate('company'); // Ambil job dan populate company

        if (!job) {
            return res.status(404).json({
                message: 'Pekerjaan tidak ditemukan',
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

        // Set pekerjaan sebagai disetujui
        job.isApproved = true; // Update status pekerjaan
        await job.save(); // Simpan perubahan

        return res.status(200).json({
            message: 'Pekerjaan berhasil disetujui',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat menyetujui pekerjaan',
            success: false
        });
    }
};


export const getAllJob = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const userId = req.id;

        // Find the user to check their role
        const user = await User.findById(userId);
        
        // Handle case when user is not found
        if (!user) {
            return res.status(404).json({
                message: 'Pengguna tidak ditemukan',
                success: false
            });
        }

        // Construct query based on user role
        const query = user.role === 'administrator' || user.role === 'business'
            ? {
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } }
                ]
            }
            : {
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } }
                ],
                isApproved: true // Candidates can only see approved jobs
            };

        const jobs = await Job.find(query).populate({
            path: 'company'
        }).sort({ createdAt: -1 });
        
        if (jobs.length === 0) {
            return res.status(404).json({
                message: 'pekerjaan tidak ditemukan',
                success: false
            });
        }
        
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server.',
            success: false
        });
    }
};


export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        const userId = req.id;
        const user = await User.findById(userId);

        // Check if the job exists and if the user has access to it
        if (!job || (user.role !== 'administrator' && user.role !== 'business' && !job.isApproved)) {
            return res.status(404).json({
                message: 'pekerjaan tidak ditemukan atau belum disetujui',
                success: false
            });
        }
        
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan pada server.',
            success: false
        });
    }
};

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id
        const jobs = await Job.find({created_by:adminId})
        if(!jobs){
            return res.status(404).json({
                message: 'pekerjaan tidak ditemukan',
                success: false
            })
        }
         return res.status(200).json({jobs, success:true})
    } catch (error) {
        console.log(error)
    }
}

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: 'pekerjaan tidak ditemukan',
                success: false
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: 'pekerjaan berhasil dihapus',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'terjadi kesalahan saat menghapus pekerjaan',
            success: false
        });
    }
}
