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

// let testGame = {
//     room: "test-room",
//     p1: "",
//     p2: "",
//     moves: 0,
// }
// games.push(testGame)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


const createRoom = (name, userID) => {
  let newGame = {
      room: name,
      p1: userID,
      p2: "",
      moves: 0,
  }
  games.push(newGame)
}

const joinRoom = (room, userID) => {
  
  for(let i = 0; i < games.length; i ++){
    //check for the correct room name
    if(games[i].name == room)
    {
      // check for if there is space in the lobby
      if(games[i].p1 == "")
      {
        // no p1, join game
        games[i].p1 = userID
      }
      else if(games[i].p2 == "")
      {
        // no p2, join game
        games[i].p2 = userID
      }
      else
      {
        // add feature to view a game without playing here?
        console.log(`Game: ${room} is full. User ${userID} cannot join.`)
      }
    }   
  }



}

io.on('connection', (socket) => {
    console.log('user connected, id: ' + socket.id);

    // send user list of active rooms
    socket.on('client request rooms', () => {
      io.emit('get rooms', games);
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected, id: ${socket.id}`);

      // disconnect them from server game data?
      // check for if they are in a game on connect?

    });

    socket.on('new room', (room) => {
      console.log("new room created: " + room);
      console.log("user " + socket.id + " joining: " + room);
      socket.join(room);
      createRoom(room, socket.id);
      // io.to(room).emit("user joined", room);
    });

    socket.on('join room', (room) => {
      console.log("user " + socket.id + " joining: " + room);
      socket.join(room);      
      joinRoom(room, socket.id)
      // io.to(room).emit("user joined", room);
    });

    socket.on('room data', (room) => {      
      // get actual room data
      let roomData
      io.to(room).emit("room data", roomData);
    });

    

});
server.listen(3000, () => {
    console.log('listening on *:3000');
  });