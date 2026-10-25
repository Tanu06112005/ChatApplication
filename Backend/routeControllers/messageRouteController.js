import mongoose from "mongoose";
import Message from "../Models/messageSchema.js";
import Conversation from "../Models/conversationModels.js";
import { io, getReceiverSocketId } from "../Socket/socket.js";

// send msg ke liye mongodb me msg store krana h 
export const sendMessage = async(req,res)=>{
    try {
        const {message} = req.body
        // const {id:receiverId} = req.params
        const receiverId = req.params.id;
        const senderId = req.user._id;

        // checking ki if in dono sender and reciever ke bw conversation chat is available or not 
        let Conversation_chat_available = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        // if sender and receiver ke bw conversation is not available then create a new conversation room with these users
        if(!Conversation_chat_available){
            Conversation_chat_available = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        // if available or create krne ke baad message add krne h 
        // creating new object for the message schema

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            conversationId:Conversation_chat_available._id
        })

        if(newMessage){
            Conversation_chat_available.messages.push(newMessage._id);  // conversation schema ke message array me store hoga
        }

        await Promise.all([Conversation_chat_available.save(),newMessage.save()]) // inserting into the mongodb
        // why used promise so that phle dono save ho jaye the next line execute ho


        // now socket.io k logic (reciever ko new message send kr rhe h)
        const receiverSocketId = getReceiverSocketId( receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

       
        res.status(201).send(newMessage)

    } catch (error) {
        res.status(500).send({
            success:false,
            message:error
        })
    }
}




// recieve krte time mongodb se msg recieve krni h ui pe reflect krne ke liye
export const recieveMessage= async(req,res)=>{
    try {
        
        // jis reciever id se vo msg aa rhi h vo get krwani h 
        // vo msg already store ho gyi hogi db me

        const receiverId = req.params.id;
        const senderId = req.user._id;

        // ab msg recieve krne se phle dekhenge ki kya conversation among these user exists?

        const conversation_available = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")//messages collection se actual messages ko unki IDs ke basis par fetch karke conversation result mein attach karke return kar raha hai.


        if(!conversation_available) return res.status(200).send([])
        
            const message = conversation_available.messages
            res.status(200).send(message)


    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
}