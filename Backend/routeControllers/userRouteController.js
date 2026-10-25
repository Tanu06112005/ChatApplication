import bcryptjs from 'bcryptjs'
import User from '../Models/userModels.js'
import jwtToken from '../utils/jwtToken.js';
import dbConnect from '../DB/dbconnect.js';

export const userRegister = async (req, res) => {

    try {
        // await dbConnect()

        const {fullname, username, email, gender, password, profilepic} = req.body;
        const user = await User.findOne({username,email});

        if(user) return res.status(500).send({success:false,message:"username or email already exists"});

            const hashPassword = bcryptjs.hashSync(password, 10); 
            const profilepicture = profilepic || `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`;
        
            const newUser = new User({
                fullname,
                username,
                email,
                password:hashPassword,
                gender,
                profilepic:profilepicture
            })
            //Here, the if(newUser) condition is basically checking whether the newUser object was successfully created before saving it to MongoDB.
            if(newUser){
                await newUser.save();  // mongodb me insert 
                // ab jaise hi user sign up kr lega vaise hi muje jwt token generate krwana h server side se 
                jwtToken(newUser._id,res)
            }
            else{
                res.status(500).send({success:false,message:"Invalid user data"})
            }
// req.body
//    ↓
// new User({...})
//    ↓
// newUser object created
//    ↓
// newUser.save()
//    ↓
// MongoDB

// abi tk we have added datat to mongo db now we need to send it to the ui/frontend

        res.status(201).send({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            profilepic:newUser.profilepic,
            email:newUser.email
        })

          

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: error
        });
    }
};


export const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body
        const userExist = await User.findOne({email})
        if(!userExist) return res.status(500).send({success:false,message:"user does not exists, not registered"})
        
        const comparepassword = bcryptjs.compareSync(password, userExist.password || "" )
        if(!comparepassword) return res.status(500).send({success:false,message:"user does not exists, not registered"})


            jwtToken(userExist._id,res) // login ke baad bhi jwt token generate krana hoga kyuki : possible case register bohot phle kiya ho and login baad me kr rhe ho
            
            res.send({
                _id:userExist._id,
                fullname:userExist.fullname,
                username:userExist.username,
                profilepic:userExist.profilepic,
                email:userExist.email,
                message:"Successfylly Loggedin",
                success:true
            })
            
    } catch (error) {
         console.log(error);

        res.status(500).send({
            success: false,
            message: error
        });
    }
}



export const userLogOut = async(req,res)=>{
    try {
        // logout means cookie ko delete krna h
        res.cookie('jwtToken',"",{
            maxAge:0
        })
        res.status(200).send({message:"user logged out"})

    } catch (error) {
          console.log(error);

        res.status(500).send({
            success: false,
            message: error
        });
    }
}