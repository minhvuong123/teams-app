const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '100mb'}));
app.use(morgan("common"));
app.use('/static', express.static('public'));

// routes
const users = require('./routes/user/user.route');
const conversation = require('./routes/conversation/conversation.route');
const messages = require('./routes/message/message.route');

app.use('/users', users);
app.use('/conversation', conversation);
app.use('/messages', messages);

// mongoose connect
mongoose.connect('mongodb://localhost/teams-app', { useNewUrlParser: true, useUnifiedTopology: true });
const connect = mongoose.connection;
connect.on('error', function(){
  console.log('Mongodb connect to fail !');
});
connect.on('open', function(){
  console.log('Mongodb connected...');
});


// socket
let usersSocket = [];
io.on("connection", (socket) => {

  // join conversation 
  // Note: room = conversation
  socket.on('join-room', ({ conversationId, userId }) => {
    socket.join(conversationId);
    socket.currenRoom = conversationId;

    // add User
    addUser(userId, socket.id);
    console.log("room: ", socket.adapter.rooms);
    console.log("usersSocket: ", usersSocket);
  });

  // leave conversation
  socket.on('leave-room', () => {
    socket.leave(socket.currenRoom);

    // remove user
    removeUser(socket.id);
    console.log("rooms: ", socket.adapter.rooms);
    console.log("usersSocket: ", usersSocket);
  })


  // send and get message
  socket.on('client-send-message', (message) => {
    console.log('message: ', message);
    console.log("currenRoom: ", socket.currenRoom);
    io.sockets.in(socket.currenRoom).emit('client-get-message', message)
  });


  // user disconnect
  socket.on('disconnect', () => {
    removeUser(socket.id);
  });
  
});

const addUser = (userId, socketId) => {
  const existUser = usersSocket.some(user => user.userId === userId);
  if (!existUser) {
    usersSocket.push({userId, socketId});
  }
}

const removeUser = (socketId) => {
  usersSocket = usersSocket.filter(user => user.socketId !== socketId)
}


// server listening
http.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
})