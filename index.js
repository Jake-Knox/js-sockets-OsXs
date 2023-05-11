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
let games = [];
let clients = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


const createRoom = (name) => {

  let newGame = {
      room:name,
      p1:"",
      p2:"",
      moves:0,
      board:["","","","","","","","",""],
  }
  games.push(newGame)
}

const joinRoom = (name, userID) => {
  
  for(let i = 0; i < games.length; i ++){
    //check for the correct room name
    if(games[i].room == name)
    {
      // check for if there is space in the lobby
      if(games[i].p1 == '')
      {
        // no p1, join game
        games[i].p1 = userID
      }
      else if(games[i].p2 == '')
      {
        // no p2, join game
        games[i].p2 = userID
      }
      else
      {
        // add feature to view a game without playing here?
        console.log(`Game: ${name} is full. User ${userID} cannot join.`)
      }
    }   
  }
}

const updateRoom = (room) => {
  for(let i = 0; i < games.length; i ++)
  {
    if(games[i].room == room)
    {
      io.to(room).emit("update room", games[i]);
    }
  }
}

const checkForWin = (room, inputBoard) => {

  let winCondition = "";

  if(inputBoard[0] == inputBoard[1] && inputBoard[1] == inputBoard[2] && inputBoard[2] != "")
  {
    winCondition =(`h1 win`);
  }
  else if(inputBoard[3] == inputBoard[4] && inputBoard[4] == inputBoard[5] && inputBoard[5] != "")
  {
    winCondition =(`h2 win`);
  }
  else if(inputBoard[6] == inputBoard[7] && inputBoard[7] == inputBoard[8] && inputBoard[8] != "")
  {
    winCondition =(`h3 win`);
  }
  if(inputBoard[0] == inputBoard[3] && inputBoard[3] == inputBoard[6] && inputBoard[6] != "")
  {
    winCondition =(`v1 win`);
  }
  else if(inputBoard[1] == inputBoard[4] && inputBoard[4] == inputBoard[7] && inputBoard[7] != "")
  {
    winCondition =(`v2 win`);
  }
  else if(inputBoard[2] == inputBoard[5] && inputBoard[5] == inputBoard[8] && inputBoard[8] != "")
  {
    winCondition =(`v3 win`);
  }
  else if(inputBoard[0] == inputBoard[4] && inputBoard[4] == inputBoard[8] && inputBoard[8] != "")
  {
    winCondition =(`d1 win`);
  }
  else if(inputBoard[2] == inputBoard[4] && inputBoard[4] == inputBoard[6] && inputBoard[6] != "")
  {
    winCondition =(`d2 win`);
  }

  if(winCondition != "")
  {
    console.log(winCondition);
    io.to(room).emit('end game');
  }
  
}

io.on('connection', (socket) => {
    console.log('user connected, id: ' + socket.id);
    io.to(socket.id).emit("get id", socket.id);

    // send user list of active rooms
    socket.on('client request rooms', () => {
      io.emit('get rooms', games);
    });

    socket.on('disconnect', () => {
      console.log(`user disconnected, id: ${socket.id}`);

      // if user disconnects, remove them from server side game data
      // if no users are connected to game, remove game from data
      for(let i = 0; i < games.length; i++)
      {
        if(games[i].p1 == socket.id)
        {
          games[i].p1 = "";
        }
        else if(games[i].p2 == socket.id)
        {
          games[i].p2 = "";
        }
        
        if(games[i].p1 == "" && games[i].p2 == "")
        {
          // delete from server game list
          const index = games.indexOf(games[i]);
          if (index > -1) {
            games.splice(index, 1); // 2nd parameter means remove one item only
          }
          // console.log(games)
        }
      }

    });

    socket.on('new room', (room) => {

      for(let i = 0; i < games.length; i ++)
      {
        if(games[i].room == room)
        {
          console.log(`room ${room} already exists`)
          // leave this func to stop new room being created
          return;
        }
      }
      console.log("new room created: " + room);
      createRoom(room, socket.id);

      console.log("user " + socket.id + " joining: " + room);
      joinRoom(room, socket.id);
      socket.join(room);
      updateRoom(room);

    });

    socket.on('join room', (room) => {

      console.log("user " + socket.id + " joining: " + room);      
      joinRoom(room, socket.id);
      socket.join(room);  
      updateRoom(room);
      // console.log(games);
    });

    socket.on('room data', (room) => {      
      // get actual room data
      io.to(room).emit("room data", roomData);
    });

    socket.on('submit turn', (room, tileIndex) => {

      // console.log("server submit turn");
      // console.log(`${room} - ${tileIndex}`);

      let user = socket.id;
      
      for(let i = 0; i < games.length; i++)
      {
        if(games[i].room == room)
        {

          if(user == games[i].p1)
          {
            games[i].board[tileIndex] = "O";
            console.log(`P1 O on tile #${tileIndex}`)
          }
          else if (user == games[i].p2) 
          {
            games[i].board[tileIndex] = "X";
            console.log(`P2 X on tile #${tileIndex}`)
          }
          else
          {
            console.log("ERROR: user does not match games info")
          }        

          games[i].moves += 1;
          io.to(room).emit("room data", games[i]);
          checkForWin(room, games[i].board);          
        }
      }          
    });

    

});
server.listen(3000, () => {
    console.log('listening on *:3000');
  });