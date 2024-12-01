import express from 'express'
import { deleteUser, getAllUser, login, logout, register, updateProfile } from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import  {singleUpload } from '../middlewares/multer.js'

const router = express.Router()
router.post('/register', singleUpload, register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/update/profile', isAuthenticated, singleUpload, updateProfile);
router.delete('/delete/:id', isAuthenticated, deleteUser);
router.get('/getalluser',isAuthenticated, getAllUser);

export default router 