
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const cors = require('cors');

app.use(cors());
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173", "https://chat-app-frontend-dwhz.onrender.com", "http://3.108.65.195:4000","https://one-click-frontend.onrender.com"],
        methods: ["GET", "POST"],
    },
});




const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
    });
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

 
module.exports = { app, io, server, getReceiverSocketId, userSocketMap };