import mongoose from "mongoose";
import { Job } from "./job.model.js"; // Pastikan path ini benar
import { Application } from './application.model.js'; // Pastikan Anda mengimpor model Application

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    logo: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isApproved: {
        type: String,
        enum: ['proses', 'diterima', 'ditolak'],
        default: 'proses'
    }
}, { timestamps: true });

// Middleware untuk menghapus Job dan Application terkait ketika Company dihapus
companySchema.pre('findOneAndDelete', async function (next) {
    const companyId = this.getQuery()._id;

    console.log(`Deleting jobs for company: ${companyId}`);
    
    const jobs = await Job.find({ company: companyId });
    const jobIds = jobs.map(job => job._id);

    console.log(`Deleting applications for jobs: ${jobIds}`);
    
    await Application.deleteMany({ job: { $in: jobIds } });
    
    console.log(`Deleting jobs for company: ${companyId}`);
    await Job.deleteMany({ company: companyId });

    next();
});


export const Company = mongoose.model("Company", companySchema);
