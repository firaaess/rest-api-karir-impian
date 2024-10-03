import {Company} from '../models/company.model.js'

export const registerCompany = async (req, res) => {
    try {
        const {companyName} = req.body
        if(!companyName) {
            return res.status(400).json({
                message:'nama perusahaan wajib di isi',
                success: false
            })
        }
        let company = await Company.findOne({name:companyName})
        if(company){
            return res.status(400).json({
                message: 'kamu tidak dapat mendaftarkan nama perusahaan yang sudah terdaftar',
                success: false 
            })
        }
        company = await Company.create({
            name: companyName,
            userId: req.id
        })
        return res.status(200).json({
            message: 'daftar perusahaan berhasil',
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id //logged in user id
        const companies = await Company.find({userId})
        if(!companies){
            return res.status(400).json({
                message: 'perusahaan tidak di temukan',
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//get company by id 
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id
        const company = await Company.findById(companyId)
        if(!company){
            return res.status(400).json({
                message: 'perusahaan tidak di temukan',
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateCompany = async (req, res) => {
    try {
        const {name, description, website, location } = req.body
        const file = req.file
        //cloud

        const updateData ={name, description, website, location }
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true})
        if(!company){
            return res.status(400).json({
                message: 'perusahaan tidak di temukan',
                success: false
            })
        }
        return res.status(200).json({
            message:'update informasi perusahaan berhasil',
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}