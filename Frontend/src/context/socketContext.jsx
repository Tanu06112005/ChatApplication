import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const useSocketContext=()=>{
    return useContext(SocketContext);
}

export const SocketContextProvider=({children})=>{
    const [socket , setSocket]= useState(null);
    const [onlineUser,setOnlineUser]=useState([]);
    const {authUser} = useAuth();

    useEffect(()=>{
        if(authUser){
            const socket = io('http://localhost:4000',{
                query:{
                    userId:authUser?._id,
                }
            })

            // backend se jo online users ka data aa rha h usko set kr rhe h (and usko context me add kr diya h means data gloally store karaya h taki it can easily be used by the other components )
            socket.on("getOnlineUsers",(users)=>{
                setOnlineUser(users)  // user is comming as an array of userId's from the backend
            });
            setSocket(socket);
            return()=>socket.close();
        }else{
            if(socket){
                socket.close();
                setSocket(null); 
            }
        }
    },[authUser]);

    return(
    <SocketContext.Provider value={{socket , onlineUser}}>
        {children}
    </SocketContext.Provider>
    )
    
}


// Haan, **SocketContext ki need tumhare ChatApp mein kaafi important hai**, especially because tum Socket.IO ko multiple components mein use kar rahe ho.

// Simple way mein samjho:

// > **SocketContext ka kaam socket connection ko ek central/global place par create karke poori React application ke components ko available karwana hai.**

// ### Tumhare code mein kya ho raha hai?

// Tumne yahan socket connection create kiya:

// ```js
// const socket = io('http://localhost:4000', {
//     query: {
//         userId: authUser?._id,
//     }
// });
// ```

// Ye connection banne ke baad tum:

// ```js
// setSocket(socket);
// ```

// kar rahe ho.

// Aur phir:

// ```jsx
// <SocketContext.Provider value={{socket, onlineUser}}>
//     {children}
// </SocketContext.Provider>
// ```

// ke through poori app ko socket de rahe ho.

// ---

// ## Agar SocketContext na hota to?

// Maan lo tumhare app mein 3 components hain:

// ```text
// App
//  ├── Sidebar
//  ├── UserList
//  └── MessageContainer
// ```

// Tumhe `MessageContainer` mein socket chahiye:

// ```js
// const {socket} = useSocketContext();
// ```

// Aur `Sidebar` mein bhi online users chahiye:

// ```js
// const {onlineUser} = useSocketContext();
// ```

// Agar Context nahi hota, to tumhe socket ko manually **props ke through pass** karna padta:

// ```text
// App
//  ↓ socket
// Sidebar
//  ↓ socket
// UserList

// App
//  ↓ socket
// MessageContainer
// ```

// Isse **prop drilling** ho sakti hai.

// Context se:

// ```text
//              SocketContext
//              /           \
//             ↓             ↓
//        Sidebar       MessageContainer
//           ↓                 ↓
//     onlineUser            socket
// ```

// Kisi bhi component ko directly mil sakta hai:

// ```js
// const { socket } = useSocketContext();
// ```

// ---

// # Tumhare ChatApp mein SocketContext ke 2 main kaam hain

// ### 1. Socket connection manage karna

// Ye:

// ```js
// useEffect(() => {
//     if (authUser) {
//         const socket = io('http://localhost:4000', {
//             query: {
//                 userId: authUser?._id,
//             }
//         });

//         setSocket(socket);

//         return () => socket.close();
//     }
// }, [authUser]);
// ```

// Login hone ke baad socket connection establish karta hai.

// Logout hone par:

// ```js
// socket.close();
// ```

// connection close ho jata hai.

// ---

// ### 2. Online users ko globally available karna

// Backend se:

// ```js
// socket.on("getOnlineUsers", (users) => {
//     setOnlineUser(users);
// });
// ```

// Agar backend bolta hai:

// ```js
// users = ["user1", "user2", "user3"]
// ```

// to Context mein:

// ```js
// onlineUser
// ```

// mein ye data store ho jata hai.

// Ab koi bhi component:

// ```js
// const { onlineUser } = useSocketContext();
// ```

// karke check kar sakta hai:

// ```js
// onlineUser.includes(user._id)
// ```

// aur UI mein green dot dikha sakta hai.

// ---

// # Tumhare `MessageContainer` mein iska use

// Tumne likha:

// ```js
// const {socket} = useSocketContext();
// ```

// Phir:

// ```js
// useEffect(() => {
//     if (!socket) return;

//     socket.on("newMessage", ...);

// }, [socket]);
// ```

// Matlab:

// ```text
// SocketContext
//       ↓
//     socket
//       ↓
// MessageContainer
//       ↓
// listen "newMessage"
//       ↓
// new message UI mein
// ```

// ---

// # Important: SocketContext aur Socket.IO same cheez nahi hain

// Ye distinction interview mein bhi useful hai.

// ### Socket.IO

// Ye actual library hai jo:

// ```js
// io(...)
// socket.on(...)
// socket.emit(...)
// ```

// provide karti hai.

// ### SocketContext

// Ye **React Context** hai jo tumne khud banaya hai:

// ```js
// const SocketContext = createContext();
// ```

// Iska purpose Socket.IO connection ko React components ke beech share karna hai.

// So:

// ```text
// Socket.IO
//    ↓
// creates/manages real-time connection

// SocketContext
//    ↓
// shares that connection across React components
// ```

// ---

// ## Ek real-life analogy

// Imagine tumhare college mein ek **Wi-Fi router** hai.

// Socket.IO connection = **Wi-Fi connection**

// SocketContext = **router ko centrally available karna**

// Different components:

// ```text
// MessageContainer → Internet
// Sidebar          → Internet
// Notification     → Internet
// OnlineStatus     → Internet
// ```

// Har component ko alag internet connection banane ki zarurat nahi.

// Similarly, tum ek socket connection banate ho:

// ```js
// const socket = io(...)
// ```

// aur Context ke through sab components ko de dete ho.

// ---

// ### Tumhare project mein architecture

// ```text
//                     AuthContext
//                         │
//                         │ authUser
//                         ↓
//                  SocketContext
//                         │
//                  creates socket
//                         │
//           ┌─────────────┼─────────────┐
//           ↓             ↓             ↓
//      Sidebar      MessageContainer  Notifications
//           │             │             │
//     onlineUser        socket         socket
//                         │
//                         ↓
//                    Socket.IO
//                         │
//                         ↓
//                   Express Server
//                         │
//                         ↓
//                      MongoDB
// ```

// **So yes, tumhare current ChatApp mein `SocketContext` rakhna useful hai.** It keeps the single socket connection centralized and lets `MessageContainer`, online-user UI, notifications, etc. access it without passing the socket through props.
