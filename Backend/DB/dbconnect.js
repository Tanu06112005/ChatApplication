import mongoose from 'mongoose'

const dbConnect = async()=>{
    try{
        console.log(process.env.DB_CONNECTION)
        await mongoose.connect(process.env.DB_CONNECTION)
         console.log("Database:", mongoose.connection.name);
        console.log("db conncted successfully")
    }catch(error){
        console.error(error)
        throw error
    }
}

export default dbConnect