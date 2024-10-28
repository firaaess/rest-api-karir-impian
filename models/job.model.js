import mongoose from "mongoose";
import { Application } from './application.model.js'; // Adjust the path as needed

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String
    }],
    salary: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    isApproved: {
        type: String,
        enum: ['proses', 'diterima', 'ditolak'],
        default: 'proses'
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        }
    ]
}, { timestamps: true });

// Pre-hook to delete applications when a job is deleted
jobSchema.pre('remove', async function(next) {
    await Application.deleteMany({ job: this._id });
    next();
});

export const Job = mongoose.model("Job", jobSchema);
