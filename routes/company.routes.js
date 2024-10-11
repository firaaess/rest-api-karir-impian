import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { deleteCompany, getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/company.controllers.js'

const router = express.Router()

router.route('/add').post(isAuthenticated,registerCompany)
router.route('/get').get(isAuthenticated,getCompany)
router.route('/get/:id').get(getCompanyById)
router.route('/update/:id').put(isAuthenticated,updateCompany)
router.route('/delete/:id').delete(isAuthenticated, deleteCompany)

export default router 