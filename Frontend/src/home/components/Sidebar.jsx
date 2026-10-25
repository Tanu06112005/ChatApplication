import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustand/useConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({onSelectUser}) => {
     const {authUser, setAuthUser} = useAuth()
     const [searchInput,setSearchInput] = useState("")
     const [searchUser,setSearchUser] = useState([])
     const [loading, setLoading] = useState(false)
     const [chatUser,setChatUser] = useState([])
     const [selectedUserId,setSelectedUserId] = useState(null)
     const {messages,selectedConversation, setSelectedConversation} = userConversation();
    //    const [newMessageUsers, setNewMessageUsers] = useState('');
       const [unreadMessages, setUnreadMessages] = useState({});
     const navigate = useNavigate()


    
     const {onlineUser,socket} = useSocketContext();

   const isUserOnline = (userId) => {
    return onlineUser.some(id => String(id) === String(userId));
    };


 useEffect(() => {

    if (!socket) return;

    const handleNewMessage = (newMessage) => {

        const senderId = String(newMessage.senderId);
        const receiverId = String(newMessage.receiverId);
        const myId = String(authUser?._id);
        const currentChatId = String(selectedConversation?._id);

        if (
            receiverId === myId &&
            senderId !== currentChatId
        ) {
            setUnreadMessages((prev) => {

                const newCount = (prev[senderId] || 0) + 1;

                console.log("PREVIOUS:", prev);
                console.log("NEW COUNT:", newCount);

                return {
                    ...prev,
                    [senderId]: newCount
                };
            });
        }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
        socket.off("newMessage", handleNewMessage);
    };

}, [socket, authUser, selectedConversation]);

    // useEffect(()=>{
    //     socket?.on("newMessage",(newMessage)=>{
    //         setNewMessageUsers(newMessage)
    //         setUnreadMessages(newMessage.length)
          
    //     })
    //     return ()=> socket?.off("newMessage");
    // },[socket,messages])

     
    
    // this function is for showing the users we chat with on hte home page 
     // only for the users to whom with the logged in user chatted with 
     useEffect(()=>{
        const chatUserHandel = async()=>{
            try {
                const chatters = await axios.get('/api/user/currentchatters')
                const data = chatters.data
                if(data.success === false){
                    setLoading(false)
                    console.log(data.message)
                }
                setLoading(false)
                setChatUser(data)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        }
        chatUserHandel()
     },[]) // har search pr ek hi baar render ho 
     console.log(chatUser)

     const handelSearchSubmit =  async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`)
            const data = search.data 
            if(data.success === false){
                setLoading(false)
                console.log(data.message)
            }
            setLoading(false)
            if(data.length===0){
                toast.info("User not found")
            }else{
                setSearchUser(data)
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
     }
    //  console.log(searchUser)

     //show which user is selected
    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedUserId(user._id);
        setSelectedConversation(user);
        
        setUnreadMessages((prev) => ({
        ...prev,
        [String(user._id)]: 0
    }));
    }

     //back from search result
    const handSearchback = () => {
        setSearchUser([]);
        setSearchInput("");
    }

    //logout 
    const handelLogOut = async()=>{
        try {
            const logout = await axios.post('/api/auth/logout')
            const data = logout.data
            if(data.success === false){
                setLoading(false)
                console.log(data.message)
            }
                toast.info(data?.message)
                localStorage.removeItem('chatapp')
                setAuthUser(null)
                setLoading(false)
                navigate('/login')

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }


   return (
    <div className='h-full w-full w-auto px-1'>
        <div className='flex  w-full justify-between gap-1'>
            <form onSubmit={handelSearchSubmit}
                className='w-[80%] h-[40px] flex items-center justify-between bg-white rounded-full'>
                <input 
                type="text"
                value={searchInput}
                onChange={(e)=>setSearchInput(e.target.value)}
                className='flex-1 min-w-0 pl-4 h-8 bg-transparent outline-none rounded-full'
                placeholder='search user'
                />
                <button 
                    className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-700 text-white hover:bg-gray-950 hover:scale-105 transition'
                    ><FaSearch />
                </button>

               
            </form>
                 
                    <img
                        // onClick={() => navigate(`/profile/${authUser?._id}`)}
                        src={authUser?.profilepic}
                        alt="Profile"
                        className='self-center h-12 w-12 rounded-full object-cover hover:scale-110 cursor-pointer'
                    />
               

        </div>
        <div className='border-b border-gray-600 mx-3'></div>



         {searchUser?.length > 0 ? (
                <>
                    {/* selected users ko show kro and back jane k option sho kro */}
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {searchUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handelUserClick(user)}
                                        className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                            } `}>

                                        {/*Socket is Online*/}
                                        
                                        {/* <div className={`avatar   ${isUserOnline(user._id) ? 'online' : ''}`}>
                                            <div className="w-12 rounded-full">
                                                <img src={user.profilepic} alt='user.img' />
                                            </div>
                                        </div> */}
                                         <div className="relative">
                                        <div className="w-12 h-12 rounded-full">
                                            <img
                                                src={user.profilepic}
                                                alt="user.img"
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        </div>

                                        {isUserOnline(user._id) && (
                                            <span className="absolute top-1/5 right-0 -translate-y-1/2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                        
                                        
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='border-b border-gray-600 mx-3'></div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handSearchback} className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowBackSharp size={25} />
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                        <h1>Why are you Alone!!🤔</h1>
                                        <h1>Search username to chat</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handelUserClick(user)}
                                                className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                                    } `}>

                                                {/*Socket is Online*/}
                                                {/* <div className={`avatar  ${isUserOnline(user._id) ? 'online' : ''}`}>
                                                    <div className="w-12 rounded-full">
                                                        <img src={user.profilepic} alt='user.img' />
                                                    </div>
                                                </div> */}
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-full">
                                                        <img
                                                            src={user.profilepic}
                                                            alt="user.img"
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    </div>

                                                    {isUserOnline(user._id) && (
                                                        <span className="absolute top-1/5 right-0 -translate-y-1/2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                                    )}
                                                </div>
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-gray-950'>{user.username}</p>
                                                </div>
                                                    {/* <div>
                                                        { newMessageUsers.receiverId === authUser._id && newMessageUsers.senderId === user._id ?
                                                    <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                                                        {unreadMessages}
                                                    </div>:<></>
                                                        }
                                                    </div> */}
                                                    {unreadMessages[String(user._id)] > 0 && (
                                                        <div className="rounded-full bg-green-700 text-sm text-white px-2 py-1 min-w-[28px] text-center">
                                                            {unreadMessages[String(user._id)]}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className='border-b border-gray-600 mx-3'></div>
                                        </div>
                                    )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handelLogOut} className='hover:bg-red-600  w-10 cursor-pointer hover:text-white rounded-lg'>
                            <BiLogOut size={25} />
                        </button>
                        <p className='text-sm py-1'>Logout</p>
                    </div>
                </>
            )}
        </div>
    )
}
export default Sidebar
