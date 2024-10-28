import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { approveJob, deleteJob, getAdminJobs, getAllJob, getJobById, getJobsByCompanyId, postJob } from '../controllers/job.controllers.js'

const router = express.Router()

router.route('/post').post(isAuthenticated,postJob)
router.route('/:id/approve').put(isAuthenticated,approveJob)
router.route('/get').get(isAuthenticated,getAllJob)
router.route('/getbusinessjobs').get(isAuthenticated, getAdminJobs)
router.route('/getbycompany/:id').get(isAuthenticated, getJobsByCompanyId)
router.route('/get/:id').get(isAuthenticated, getJobById)
router.route('/delete/:id').delete(isAuthenticated, deleteJob)

export default router 