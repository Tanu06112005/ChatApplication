import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId, // ID ka data type ref: "User" ➡️ ye ID kis Model/document ko refer kar rahi hai
            ref:"User"
        }
    ],
    messages:[
         {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            default:[]
        }
    ]
},{timestamp:true})


const Conversation = mongoose.model('Conversation',conversationSchema)

 export default Conversation