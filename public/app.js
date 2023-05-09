var socket = io();

const chars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]


let myName = "placeholder_name";
let myRooms = [];


// document variables

const formNew = document.getElementById('form-new');
const inputNew = document.getElementById('form-new-input');

const formJoin = document.getElementById('form-join');
const inputJoin = document.getElementById('form-join-input');


const refreshGame = document.getElementById("btn-refresh");
const activeGames = document.getElementById("active-games");




// event listeners

formNew.addEventListener('submit', function(e) {
    e.preventDefault();
    if (inputNew.value) {
        // console.log("form submit");
    socket.emit('new room', inputNew.value);
    inputNew.value = '';

    socket.emit('client request rooms')
    }
});

formJoin.addEventListener('submit', function(e) {
    e.preventDefault();
    if (inputJoin.value) {
        // console.log("form submit");
    socket.emit('join room', inputJoin.value);
    inputJoin.value = '';

    socket.emit('client request rooms')
    }
});

refreshGame.addEventListener('click', function() {
    socket.emit('client request rooms');
});


socket.on('get rooms', function(games) {
    myRooms = games;

    activeGames.innerHTML = "";

    for (let i = 0; i < myRooms.length; i++) {
        // logging game room info
        // console.log(myRooms[i].room)
        // console.log(myRooms[i].p1)
        // console.log(myRooms[i].p2)
        // console.log(myRooms[i].moves)

        const newGame = document.createElement("div");
        // newGame.textContent = (`Room: ${myRooms[i].room} | P1: ${myRooms[i].p1} | P2: ${myRooms[i].p2} | moves: ${myRooms[i].moves}`)
        newGame.textContent = (`${myRooms[i].room} | ${myRooms[i].p1} | ${myRooms[i].p2} | ${myRooms[i].moves}`)

        activeGames.appendChild(newGame);
    }

});

socket.on('update room', function(newDetails) {

    for (let i = 0; i < myRooms.length; i++) {
        // logging game room info
        // console.log(newDetails[i].room)
        // console.log(newDetails[i].p1)
        // console.log(newDetails[i].p2)
        // console.log(newDetails[i].moves)
        console.log(newDetails[i].board)
    }

});




// testing stuff to run when the page loads

// socket.emit('join room', "test-room"); 
// socket.emit('client request rooms')
