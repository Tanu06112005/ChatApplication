import React,{useEffect,useState,useRef} from 'react'
import { TiMessages } from 'react-icons/ti'
import { useAuth } from '../../context/AuthContext'
import userConversation from '../../Zustand/useConversation'  
import { IoArrowBackSharp, IoSend } from 'react-icons/io5'
import axios from 'axios'
import notify from '../../assets/universfield-new-notification-051-494246.mp3'
import { useSocketContext } from '../../context/SocketContext'


const MessageContainer = ({onBackButtonClick}) => {
  const {messages,setMessages,selectedConversation, setSelectedConversation} = userConversation();
  const {authUser} = useAuth();
  const [Loading, setLoading] = useState(false)
  const [sending , setSending] = useState(false);
  const [sendData , setSendData] = useState("")
  const lastMessageRef = useRef();
  const {socket} = useSocketContext();

    useEffect(()=>{
      if(!socket) return;
      socket.on("newMessage",(newMessage)=>{
        const sound = new Audio(notify)
        sound.play().catch((error) => {
      console.log("Sound error:", error);
    });
        setMessages([...messages,newMessage])
      })

      return () => socket.off("newMessage")
    },[socket,setMessages,messages])
    
  // here i am trying to get the messages the logged in user has done with the selected user (conversation me)
  useEffect(()=>{

      const getMessages = async()=>{
        setLoading(true);
        try{
          const getmsg = await axios.get(`api/message/${selectedConversation?._id}`)
          const data = await getmsg.data;
          if(data.success === false){
            setLoading(false)
            console.log(data.message)
          }
          setLoading(false)
          setMessages(data)
        }catch(error){
          setLoading(false)
          console.log(error)
        }
      }
    if (selectedConversation?._id) getMessages();
  },[selectedConversation?._id, setMessages])
  console.log(messages)

  
    const handelMessages=(e)=>{
        setSendData(e.target.value)
      }


      //Is useEffect ka purpose chat ko automatically latest message tak scroll karna hai.
      // setTimeout isliye kyuki jb new msg ayega to usko render hone me time lgta h a bit 
    useEffect(()=>{
        setTimeout(()=>{
            lastMessageRef?.current?.scrollIntoView({behavior:"smooth"})
        },100)
    },[messages])

  const handelSubmit=async(e)=>{
        e.preventDefault();
        setSending(true);
        try {
            const res =await axios.post(`/api/message/send/${selectedConversation?._id}`,{message:sendData});
            const data = await res.data;
            if (data.success === false) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSendData('')
            setMessages([...messages,data])
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    }

  return (
    <div className='md:min-w-[500px] h-[99%] flex flex-col py-2'>
      {selectedConversation === null? (
        <div className='flex items-center justify-center w-full h-full'>
          <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2'>
            <p className='text-2xl'>Welcome..! 👋{authUser.username} 😉</p>
            <p className='text-lg'>Select a user to start chatting </p>
            <TiMessages className='text-6xl text-center' />
          </div>
        </div>
      ):(
        <>
          <div className='flex items-center bg-sky-600 md:px-2 rounded-lg h-12 md:h-14 shrink-0'>
            <div className='flex gap-2 md:justify-between items-center w-full'>
              
              <div className='md:hidden ml-1 self-center'>
                <button onClick={()=>onBackButtonClick(true)} className='bg-white rounded-full px-2 py-1 self-center'>
                  <IoArrowBackSharp size={25}/>
                </button>
              </div>

              <div className='flex justify-between mr-2 gap-2'>
                <div className='self-center'>
                  <img className='rounded-full w-10 h-10 md:w-10 md:h-10 cursor:pointer'
                    src={selectedConversation?.profilepic} alt="profile" />
                </div>
                <span className='text-gray-950 self-center text-xl md:text-xl font-bold'>
                  {selectedConversation?.username}
                </span>
              </div>
              
            </div>
          </div>

          <div className='flex-1 min-h-0 overflow-auto '>
             {Loading && (
                <div className="flex w-full h-full flex-col items-center justify-center 
                gap-4 bg-transparent">
                  <div className="loading loading-spinner"></div>
                </div>
              )}
              {!Loading && messages?.length === 0 && (
                <p className='text-center text-white items-center'>Send a message to 
                start Conversation</p>
              )}
               {!Loading && messages?.length > 0 && messages?.map((message) => (
                <div className='text-white' key={message?._id} ref={lastMessageRef}>
                  
                  <div className={` w-full flex flex-col
                    ${message.senderId === authUser._id ? 'justify-end' : 'justify-start'} px-4 py-2 h-[25%] text-2xl`}>
                    {/* <div className='chat-image avatar'></div> */}
                    
                    <div className={`w-fit  px-3 py-2 rounded-2xl break-words text-base ${message.senderId === authUser._id ? 'bg-sky-600 text-white self-end rounded-br-sm' : 'bg-black/60 text-white self-start rounded-bl-sm'} px-2px py-1px`}>
                      {message?.message}
                    </div>

                    <div
                      className={`text-[10px] text-white/70 mt-1 ${
                        message.senderId === authUser._id
                          ? 'text-right'
                          : 'text-left'
                      }`}>
                      {new Date(message?.createdAt).toLocaleDateString('en-IN')}{" "}
                      {new Date(message?.createdAt).toLocaleTimeString('en-IN', { 
                        hour: 'numeric', 
                        minute: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
          </div>

             <form onSubmit={handelSubmit} className='rounded-full text-black'>
              <div className='w-full rounded-full flex items-center bg-white'>
                <input value={sendData} onChange={handelMessages} required id='message' type='text' 
                  className='w-full bg-transparent outline-none px-4 rounded-full'/>
                <button type='submit'>
                  {sending ? <div className='loading loading-spinner'></div>:
                    <IoSend size={25}
                    className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1'/>
                  }
                </button>
              </div>
            </form>

        </>
      )
    }
        
    </div>
  )
}

export default MessageContainer
