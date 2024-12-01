import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { joinWeb } from "../utils/msgEmail.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Validasi input
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Semua kolom harus terisi",
                success: false
            });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Format email tidak valid",
                success: false
            });
        }

        // Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email tersebut sudah terdaftar',
                success: false,
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhotoUrl = null;

        // Validasi bahwa file adalah image
        if (req.file) {
            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    message: "File yang diunggah harus berupa gambar",
                    success: false
                });
            }
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url; // Simpan URL foto profil
        }

        // Buat pengguna baru
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });
        await joinWeb(email, fullname);
        return res.status(201).json({
            message: "Berhasil membuat akun",
            success: true
        });
    } catch (error) {
        console.error(error); // Log error ke console
        return res.status(500).json({
            message: "Terjadi kesalahan pada server",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        
        if (!email || !password ) {
            return res.status(400).json({
                message: "semua kolom harus terisi",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "akun tidak di temukan atau email salah",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "kesalahan password",
                success: false,
            })
        };
        

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `selamat datang kembali ${user.fullname}`,
            user,
            token : token,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logout berhasil",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, currentPassword, newPassword } = req.body;
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "akun tidak ditemukan",
                success: false
            });
        }

        // Update fields if provided
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        // Process skills if provided
        if (skills && skills.trim()) {
            user.profile.skills = skills.split(",").map(skill => skill.trim());
        }

        // Handle password update if provided
        if (currentPassword && newPassword) {
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    message: "password lama salah",
                    success: false
                });
            }
            // Hash new password and update it
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Validasi dan upload file (gambar atau resume)
        if (req.files) {
            const { profilePhoto, resume } = req.files;
            
            // Validasi dan upload profile photo jika ada
            if (profilePhoto && profilePhoto[0]) {
                const profilePhotoFile = profilePhoto[0]; // Get the file object
                console.log("Profile photo mimetype:", profilePhotoFile.mimetype);
                
                if (!profilePhotoFile.mimetype.startsWith("image/")) {
                    return res.status(400).json({
                        message: "File profile photo harus berupa gambar",
                        success: false
                    });
                }
                const photoUri = getDataUri(profilePhotoFile);
                const photoResponse = await cloudinary.uploader.upload(photoUri.content);
                user.profile.profilePhoto = photoResponse.secure_url;
                user.profile.profilePhotoOriginalName = profilePhotoFile.originalname;
            }

            // Validasi dan upload resume jika ada
            if (resume && resume[0]) {
                const resumeFile = resume[0]; // Get the file object
                console.log("Resume mimetype:", resumeFile.mimetype);
                
                if (resumeFile.mimetype !== "application/pdf") {
                    return res.status(400).json({
                        message: "File resume harus berupa PDF",
                        success: false
                    });
                }
                const resumeUri = getDataUri(resumeFile);
                const resumeResponse = await cloudinary.uploader.upload(resumeUri.content);
                user.profile.resume = resumeResponse.secure_url;
                user.profile.resumeOriginalName = resumeFile.originalname;
            }
        }

        await user.save();

        return res.status(200).json({
            message: "Selamat Akun Berhasil Di Perbarui",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // Ambil ID pengguna dari parameter
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Akun tidak ditemukan',
                success: false
            });
        }

        // Hapus perusahaan terkait userId
        const companies = await Company.find({ userId }); // Temukan semua perusahaan yang terkait dengan pengguna
        const companyIds = companies.map(company => company._id); // Ambil ID perusahaan

        // Hapus semua pekerjaan terkait perusahaan yang dihapus
        const jobs = await Job.find({ company: { $in: companyIds } }); // Temukan semua pekerjaan yang terkait dengan perusahaan
        const jobIds = jobs.map(job => job._id); // Ambil ID pekerjaan

        // Hapus semua aplikasi terkait pekerjaan yang dihapus
        await Application.deleteMany({ job: { $in: jobIds } }); // Hapus semua aplikasi yang berelasi dengan pekerjaan
        await Application.deleteMany({ applicant: userId }); // Hapus semua aplikasi yang berelasi dengan pekerjaan

        // Hapus semua pekerjaan terkait perusahaan yang dihapus
        await Job.deleteMany({ company: { $in: companyIds } });

        // Hapus perusahaan yang terkait
        await Company.deleteMany({ userId });

        // Hapus akun pengguna
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: 'Akun, perusahaan, pekerjaan, dan aplikasi terkait berhasil dihapus',
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat menghapus akun',
            success: false
        });
    }
};


export const getAllUser = async (req, res) => {
    try {
        const userId = req.id
        const users = await User.find({})
        if(!users){
            return res.status(404).json({
                message: 'akun tidak ditemukan',
                success: false
            })
        }
        return res.status(200).json({
            users,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

