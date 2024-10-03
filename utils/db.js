import mongoose from "mongoose";
const connDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongodb connected succesfuly')
    } catch (error) {
        console.log(error)
    }
}

export default connDB