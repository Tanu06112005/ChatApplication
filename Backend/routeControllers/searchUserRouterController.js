
import Conversation from "../Models/conversationModels.js"
import User from "../Models/userModels.js"


// getting all the search users
export const getUserBySearch = async (req, res)=>{
    try {
        const search = req.query.search || ""
        const currentUserId = req.user._id   // req.user isLogin middleware se aa rha h
                // const currentUserId = req.user.conditions._id

        // search k logic 
            // only those who matches usernamr or full name 
            // but it should not be the current user itself (m khud ko kyu search kru)

        const user = await User.find({
            $and:[
                {
                    $or:[
                        {username:{$regex:'.*'+search+'.*', $options:'i'}},
                        {fullname:{$regex:'.*'+search+'.*', $options:'i'}}
                    ]
                },
                {
                   _id:{$ne:currentUserId} 
                }
            ]
        }).select("-password").select("email")

        res.status(200).send(user)


    } catch (error) {
        res.status(500).send({
            success:false,
            message:error.message
        })
    }
}

// now we need to show the users with which the user logged in chat 
// Ye function current logged-in user ke saath chat karne wale saare users (chatters) ko fetch karne ke liye hai.
export const getCurrentChatters = async(req,res)=>{
    try {

        // MongoDB se wo saari conversations fetch karo jinke participants array mein current user present hai.
        const currentUserId = req.user._id  // req.user isLogin middleware se aa rha h
        const CurrentChatters = await Conversation.find({
            participants:currentUserId
        }).sort({
            updatedAt: -1
        })
        // sort kr diya time ke according to vo apne aap new-updated one will appear at the top

        // if koi chat nhi h
        if(!CurrentChatters || CurrentChatters.length === 0) return res.status(200).send([])
        

            // abhi hamare pas CurrentChatters ke participants field me current user + other user aa rhe h but hme onlt other user chahiye 
        
            const participantsIDs = CurrentChatters.reduce((ids,conver)=>{
//reduce() array ke har element par ek-ek baar function chalata hai aur ultimately ek single value return karta hai.
            const otherParticipants = conver.participants.filter(id=> id !== currentUserId)
            return [...ids, ...otherParticipants]
        },[])
        // Ab hume sirf un users ki IDs mili jinse current user chat kar raha hai.

        const otherParticipantsIDs = participantsIDs.filter(id=>id.toString() !== currentUserId.toString())
        
        const user = await User.find({_id:{$in:otherParticipantsIDs}}).select("-password").select("-email")
        
        const users = otherParticipantsIDs.map(id => user.find(user => user._id.toString() === id.toString()))
        
        res.status(200).send(users)

        
    } catch (error) {
         res.status(500).send({
            success:false,
            message:error.message
        })
        
    }
}


// array.reduce((accumulator, currentValue) => {
//     // logic
//     return accumulator;
// }, initialValue)