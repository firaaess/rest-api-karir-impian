import {Job} from '../models/job.model.js'
import {Application} from '../models/application.model.js'

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const getApliedJob = async (req, res) => {
    try {
        const userId = req.id
        const application = await Application.find({applicant: userId}).sort({created_At: -1}).populate({
            path: 'job',
            options: {sort:{createdAt: -1}},
            populate: {
                path: 'company',
                options: {sort:{createdAt: -1}}
            }
        })
        if(!application){
            return res.status(400).json({
                message: 'data tidak di temukan',
                success: false
            })
        }
        return res.status(200).json({
            application,
            success:true
        })
    }catch (error) {
        console.log(error)
    }
}

export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req, res) => {
    try {
        const {status} = req.body
        const applicationId= req.params.id
        if(!status){
            return res.status(400).json({
                message: 'status harus di isi',
                success: false
            })
        }
        const application = await Application.findOne({_id:applicationId})
        if(!application){
            return res.status(400).json({
                message: 'data tidak di temukan',
                success: false
            })
        }
        application.status = status.toLowerCase()
        await application.save()
        return res.status(200).json({
            message: 'status berhasil di update',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//tinggal membuat router 3.01.20