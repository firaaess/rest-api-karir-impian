import {Job} from '../models/job.model.js'
import {Application} from '../models/application.model.js'

export const applyJob = async (req, res) => {
    try {
        const userId = req.id
        const jobId = req.params.id
        if(!jobId){
            return res.status(400).json({
                message: 'id job harus terisi',
                success: false
            })
        }
        const existingApplication = await Application.findOne({job: jobId, applicant : userId})
        if(existingApplication) {
            return res.status(400).json({
                message: 'anda sudah melamar pekerjaan ini',
                success: false
            })
        }
        const job = await Job.findById(jobId)
        if(!job) {
            return res.status(404).json({
                message: 'pekerjaan tidak di temukan',
                success: false
            })
        }
        const newApplication = Application.create({
            job: jobId,
            applicant: userId
        })
        job.application.push(newApplication._id)
        await job.save()
        return res.status(200).json({
            message: 'berhasil melamar pekerjaan',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

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

export const getApplicants = async (req, res) => {
    try {
       const jobId = req.params.id
       const job = await Job.findById(jobId).populate({
        path: 'applications',
        options :{sort:{created_At: -1}},
        populate:{
            path:'applicant'
        }
       })
       if(!job) {
        return res.status(400).json({
            message: 'pekerjaan tidak di temukan',
            success: false
        })
       }
       return res.status(200).json({
        job,
        success: true
       })
    } catch (error) {
        console.log(error)
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