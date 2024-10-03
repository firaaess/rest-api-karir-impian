import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const register = async (req,res) => {
    try {
        const {fullname, email, phoneNumber, password, role } = req.body
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message:'something is missing',
                success:false
            })
        }
        const user = await User.findOne({email})
        if (user){
            return res.status(400).json({
                message:'User already exist with this email',
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            fullname,
            email,
            phoneNumber,
            password :  hashedPassword,
            role,

        })
        return res.status(200).json({
            message:'akun berhasil di tambahkan',
            succes:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req,res) => {
    try {
        const {email , password , role} = req.body
        if (!email || !password || !role) {
            return res.status(400).json({
                message:'something is missing',
                success:false
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:'email salah',
                success:false
            })
        }
        const isPasswordMatch =await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message:'password salah',
                success:false
            })
        }
        //cek role
        if(role !== user.role){
            return res.status(400).json({
                message:'Akun tidak ada dengan role tersebut',
                success:false
            })
        }
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'})
        
        // Create a new user object to return
       const userRes= {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };
        return res.status(200).cookie('token', token , {maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
            message:`selamat datang kembali ${user.fullname}`,
            user : userRes,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie('token', '', {maxAge:0}).json({
            message:'berhasil keluar',
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateProfile = async( req, res) => {
    try {
        const {fullname, email, phoneNumber, bio, skills } = req.body
        const file = req.file 
        //  cloudinary
        let skillsArray;
        if(skills){
            skillsArray = skills.split(',')
        }
        const userId = req.id;
        console.log(userId)
        let user = await User.findById(userId)
        if(!user){
            return res.status(400).json({
                message:"akun tidak di temukan",
                success: false
            })
        }
        //update data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
       if(phoneNumber)  user.phoneNumber = phoneNumber
       if(bio) user.profile.bio = bio
       if(skills)  user.profile.skills = skillsArray

        await user.save()
        const userRes = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };
        return res.status(200).json({
            message:"profile berhasil diperbarui",
            user : userRes,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}