import mongoose from 'mongoose'


// creating schema->model
const userSchema = mongoose.Schema({
    
    // required during registration
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
        
    },
    gender:{
        type:String,
        required:true,
        enum:["male",'female']
        // enum : used when a variable should have only a fixed set of possible
    },
    password:{
        type:String,
         required:true,
        unique:true,
        minlength:6
    },
    profilepic:{
        type:String,
        required:true,
        default:""
    }
},{timestamps:true})

const User = mongoose.model('users',userSchema);

export default User;