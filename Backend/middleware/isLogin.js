import jwt from 'jsonwebtoken'
import User from '../Models/userModels.js'

const isLogin =async (req,res,next)=>{
    try {
        // console.log(req.cookies.jwtToken)
        const token = req.cookies.jwtToken;
        console.log(token)
        console.log()
        // if no token foung : not login
        if(!token) return res.status(500).send({success:false,message:"User Unauthorized."})
            const decoded = jwt.verify(token,process.env.SECRET_KEY)
        // if jwt token verify hi nhi ho paya to 
        if(!decoded)  return res.status(500).send({success:false,message:"User Unauthorized."})
            const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(404).send({success:false,message:"User not found"})
            req.user= user;

        next()
        
    } catch (error) {
        console.log(`error in isLogin middleware ${error.message}`)
        res.status(500).send({
            success:false,
            message:error
        })
    }
}

export default isLogin;