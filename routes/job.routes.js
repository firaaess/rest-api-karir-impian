import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { deleteJob, getAdminJobs, getAllJob, getJobById, postJob } from '../controllers/job.controllers.js'

const router = express.Router()

router.route('/post').post(isAuthenticated,postJob)
router.route('/get').get(getAllJob)
router.route('/getadminjobs').get(isAuthenticated, getAdminJobs)
router.route('/get/:id').get(getJobById)
router.route('delete/:id').delete(isAuthenticated, deleteJob)

export default router 