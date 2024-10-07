import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { applyJob, getApliedJob, getApplicants, updateStatus } from '../controllers/application.controllers.js'

const router = express.Router()

router.route('/apply/:id').get(isAuthenticated,applyJob)
router.route('/get').get(isAuthenticated,getApliedJob)
router.route('/:id/applicant').get(isAuthenticated, getApplicants)
router.route('/status/:id/update').post(isAuthenticated,updateStatus)


//test api 3.07

export default router 