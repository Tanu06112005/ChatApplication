// import  timestamps  from "mongodb";
import mongoose from "mongoose";

// kon send kr rha h
// kon recieve krega 
// msg kya h 
// aur kis conversation me jayega

const messageSchema =  mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Conversation',
        default:[]
    }
},{timestamps:true})

const Message = mongoose.model('Message',messageSchema);

export default Message 