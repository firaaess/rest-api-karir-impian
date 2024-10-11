import {Job} from '../models/job.model.js'

export const postJob = async (req, res) => {
    try {
        const {title, description, requirements, salary, location, jobType,experience , position, companyId} = req.body
        const userId = req.id
        if(!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId){
            return res.status(400).json({
                message: 'semua data harus terisi',
                success: true
            })
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
            company: companyId,
            created_by : userId
        })
        return res.status(200).json({
            message: 'berhasil menambahkan pekerjaan baru',
            job,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//2:35:09
export const getAllJob = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {decription:{$regex:keyword, $options:"i"}}
            ]
        }
        const jobs = await Job.find(query).populate({
            path:'company'
        }).sort({createdAt:-1})
        if(!jobs){
            return res.status(404).json({
                message: 'pekerjaan tidak ditemukan',
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
        if(!job){
            return res.status(404).json({
                message: 'pekerjaan tidak ditemukan',
                success: false
            })
        }
        return res.status(200).json({job, success:true})
    } catch (error) {
        console.log(error)
    }
}

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
