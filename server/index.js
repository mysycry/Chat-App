const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

const server = http.createServer(app); //allows the WebSocket server to use the same HTTP server instance as the Express application.

const io = new Server(server, {
  cors: {
    //CORS Config
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  //sets up an event listener for the 'connection' event on the 'socket.io' server
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    // event listener for the 'join_room' event
    socket.join(data); //allows the socket to be part of the room and receive messages sent to that room.
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    //event listener for the 'send_message' event
    socket.to(data.room).emit('receive_message', data); //sends the data object
    console.log(data);
  });

  socket.on('disconnect', () => {
    //event listener for the 'disconnect' event
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  //listens on port 3001 for incoming WebSocket connections.
  console.log('Server Running');
});
