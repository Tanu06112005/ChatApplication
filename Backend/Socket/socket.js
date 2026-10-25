import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
// socket server built on the top of the express server

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        methods:["GET", "POST"]
    }
})

export const getReceiverSocketId = (receiverId)=>{
    return userSocketmap[receiverId];
}

const userSocketmap = {};  // {userId,socketId}
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId !== 'undefined') userSocketmap[userId]= socket.id; // socket.id socket khud create krta h
    io.emit("getOnlineUsers", Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

export {app, io, server}


// Client
//   |
//   |  connect + userId
//   ↓
// Socket.IO Server
//   |
//   |  handshake
//   ↓
// socket.handshake.query.userId
//   |
//   ↓
// User ID mil gayi

// userId frontend ke socket se aa rhi h


// Haan, is part ko **line by line** samjho. Ye basically **online users ki list update** karne ka kaam kar raha hai.

// ```js
// io.emit("getOnlineUsers", Object.keys(userSocketmap))

// socket.on('disconnect',()=>{ 
//     delete userSocketmap[userId]
//     io.emit('getOnlineUsers', Object.keys(userSocketmap))
// });
// ```

// ### 1. `Object.keys(userSocketmap)`

// Maan lo `userSocketmap` hai:

// ```js
// const userSocketmap = {
//     "user101": "socketA",
//     "user102": "socketB",
//     "user103": "socketC"
// }
// ```

// `Object.keys(userSocketmap)` karega:

// ```js
// ["user101", "user102", "user103"]
// ```

// Yaani **currently connected users ke user IDs** mil jayenge.

// ---

// ### 2. `io.emit("getOnlineUsers", Object.keys(userSocketmap))`

// ```js
// io.emit("getOnlineUsers", ["user101", "user102", "user103"])
// ```

// `io.emit()` ka matlab:

// > **Server se connected sabhi clients ko event bhejo.**

// Event ka naam:

// ```js
// "getOnlineUsers"
// ```

// Data:

// ```js
// ["user101", "user102", "user103"]
// ```

// Frontend me humne iska listener lagaya tha:

// ```js
// socket.on("getOnlineUsers", (users) => {
//     setOnlineUser(users);
// });
// ```

// Toh frontend ko pata chal gaya:

// ```text
// user101 → online
// user102 → online
// user103 → online
// ```

// ---

// ## 3. `socket.on('disconnect', () => {})`

// Ye bahut important hai.

// ```js
// socket.on('disconnect', () => {
// ```

// Iska matlab:

// > **Jab ye particular user Socket.IO se disconnect ho jaye, tab ye code chalao.**

// Disconnect kab ho sakta hai?

// * User browser close kare
// * Tab close kare
// * Logout kare
// * Internet connection chala jaye
// * Socket connection break ho jaye

// ---

// ## 4. `delete userSocketmap[userId]`

// Maan lo pehle:

// ```js
// userSocketmap = {
//     "user101": "socketA",
//     "user102": "socketB",
//     "user103": "socketC"
// }
// ```

// Ab `user102` disconnect ho gaya.

// ```js
// delete userSocketmap[userId]
// ```

// Agar:

// ```js
// userId = "user102"
// ```

// toh map ban jayega:

// ```js
// {
//     "user101": "socketA",
//     "user103": "socketC"
// }
// ```

// Matlab:

// > `user102` ab online users ki list se remove ho gaya.

// ---

// ## 5. Phir se `io.emit()`

// Ab:

// ```js
// io.emit("getOnlineUsers", Object.keys(userSocketmap))
// ```

// ab `Object.keys()` return karega:

// ```js
// ["user101", "user103"]
// ```

// Aur ye updated list **sabhi connected clients ko bhej di jayegi**.

// Frontend:

// ```js
// socket.on("getOnlineUsers", (users) => {
//     setOnlineUser(users);
// });
// ```

// ab:

// ```js
// onlineUser = ["user101", "user103"]
// ```

// Toh UI me `user102` ka **online indicator remove** ho jayega.

// ---

// ### Pura flow ek example se

// Initially:

// ```js
// userSocketmap = {}
// ```

// ### User A connects

// ```js
// userSocketmap = {
//     A: socket1
// }
// ```

// Server:

// ```js
// io.emit("getOnlineUsers", ["A"])
// ```

// Frontend:

// ```text
// A 🟢
// ```

// ### User B connects

// ```js
// userSocketmap = {
//     A: socket1,
//     B: socket2
// }
// ```

// Server:

// ```js
// io.emit("getOnlineUsers", ["A", "B"])
// ```

// Frontend:

// ```text
// A 🟢
// B 🟢
// ```

// ### User A disconnects

// ```js
// delete userSocketmap["A"]
// ```

// Now:

// ```js
// userSocketmap = {
//     B: socket2
// }
// ```

// Then:

// ```js
// io.emit("getOnlineUsers", ["B"])
// ```

// Frontend:

// ```text
// A ⚪
// B 🟢
// ```

// ### Short mein

// ```text
// User connects
//       ↓
// userSocketmap me add
//       ↓
// Object.keys(userSocketmap)
//       ↓
// Online users ki IDs
//       ↓
// io.emit()
//       ↓
// Sabhi frontend ko updated list
// ```

// Aur disconnect par:

// ```text
// User disconnects
//       ↓
// userSocketmap se delete
//       ↓
// Updated online users list
//       ↓
// io.emit()
//       ↓
// Sabhi frontend update
// ```

// **Important:** `Object.keys(userSocketmap)` me **user IDs** aa rahi hain, `socket.id` nahi. `userSocketmap` ka structure `userId → socket.id` hai.

