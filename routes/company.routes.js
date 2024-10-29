import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { addCompany, approveCompany, deleteCompany, getCompany, updateCompany } from '../controllers/company.controllers.js'
import { singleUpload } from '../middlewares/multer.js'

const router = express.Router()

router.route('/add').post(isAuthenticated ,addCompany)
router.route('/get').get(isAuthenticated,getCompany)
router.route('/:id/approve').put(isAuthenticated,approveCompany)
router.route('/update/:id').put(isAuthenticated,singleUpload,updateCompany)
router.route('/delete/:id').delete(isAuthenticated, deleteCompany)

export default router 