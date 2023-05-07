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


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


server.listen(3000, () => {
    console.log('listening on *:3000');
  });