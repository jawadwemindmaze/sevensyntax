const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handler to join a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('sendMessage', (message) => {
        console.log(message);
        // Emit the message only to users in the specified room
        io.to(message.channelId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
