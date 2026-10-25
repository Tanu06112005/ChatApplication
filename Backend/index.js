import 'dotenv/config';
import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './DB/dbconnect.js';
import authRouter from './route/authUser.js'
import messageRouter from './route/messageRoute.js'
import cookieParser from 'cookie-parser';
import userRouter from './route/usersRoute.js'
import path from 'path'

// const app = express()

import {app, server} from './Socket/socket.js'


// for deploying the frontend and backend together
const __dirname = path.resolve();

dotenv.config();

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

// for deploying the frontend and backend together
 app.use(express.static(path.join(__dirname,"/Frontend/dist")))

 app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname,"Frontend","dist","index.html"))
 })

app.get('/', (req,res)=>{
    res.send({
        msg:"server created",
        success:true
    })
})

const PORT = process.env.PORT || 4000
// app.listen(PORT, ()=>{
//     dbConnect()
//     console.log(`server is runnig on the port ${PORT}`)
// })
const startServer = async () => {
    try {
        // Pehle MongoDB connect hoga
        await dbConnect();

        // MongoDB connect hone ke baad server start hoga
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.log("Server startup error:", error.message);
    }
};

startServer();