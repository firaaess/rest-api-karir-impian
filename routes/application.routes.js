import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { applyJob, getAppliedJob, getApplicants, updateStatus, getApplicantById } from '../controllers/application.controllers.js'

const router = express.Router()

router.route('/apply/:id').get(isAuthenticated,applyJob)
router.route('/get').get(isAuthenticated,getAppliedJob)
router.route('/applicant/:id').get(isAuthenticated,getApplicantById)
router.route('/:id/applicant').get(isAuthenticated, getApplicants)
router.route('/status/:id/update').post(isAuthenticated,updateStatus)


//test api 3.07

export default router 