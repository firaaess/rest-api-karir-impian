import express from 'express'
import { deleteUser, getAllUser, login, logout, register, updateProfile } from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.js'

const router = express.Router()

router.route('/register').post(singleUpload,register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/update/profile').post(isAuthenticated, singleUpload,updateProfile)
router.route('/delete/:id').delete(isAuthenticated, deleteUser)
router.route('/list').get(getAllUser)

export default router 