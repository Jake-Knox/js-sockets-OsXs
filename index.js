const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

// run server normally         -> node index.js
// run nodemon updating server -> nodemon ./index.js localhost 3000

// game vars
games = [];

let testGame = {
    room: "test-room",
    p1: "",
    p2: "",
    moves: 0,
}
games.push(testGame)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected');

    // send user list of active rooms
    io.emit('get rooms', games);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('new room', (room) => {
      console.log("new room created: " + room);
      console.log("user " + socket.id + " joining: " + room);
      socket.join(room);
      // io.to(room).emit("user joined", room);
    });

    socket.on('join room', (room) => {
      console.log("user joining: " + room);
      socket.join(room);
      // io.to(room).emit("user joined", room);
    });

    

});
server.listen(3000, () => {
    console.log('listening on *:3000');
  });