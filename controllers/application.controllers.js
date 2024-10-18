import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "id pekerjaan harus terisi",
                success: false
            })
        };
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "kamu sudah melamar pekerjaan ini",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "pekerjaan tidak ada",
                success: false
            })
        }
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"berhasil melamar pekerjaan",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getAppliedJob = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate('company').populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        

        if (!job) {
            return res.status(404).json({
                message: 'Pekerjaan tidak ada',
                success: false
            });
        }

        // Cek apakah pengguna adalah pemilik perusahaan
        const userId = req.id; // ID pengguna yang melakukan permintaan
        if (!job.company || !job.company.userId) {
            return res.status(403).json({
                message: 'Company information is not available.',
                success: false
            });
        }
        if (job.company.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'Anda tidak memiliki izin.',
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mendapatkan pelamar',
            success: false
        });
    }
};


export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status harus terisi',
                success: false
            });
        }

        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({
                message: "tidak ada pelamar",
                success: false
            });
        }

        // Cek apakah pengguna adalah pemilik perusahaan
        const userId = req.id; // ID pengguna yang melakukan permintaan
        if (application.job.company.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'Anda tidak memiliki izin',
                success: false
            });
        }

        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Berhasil mengupdate status",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui status',
            success: false
        });
    }
};
