var socket = io();

let myRooms = []

// document variables

const form = document.getElementById('form-new');
const input = document.getElementById('form-input');

const activeGames = document.getElementById("active-games");



// event listeners

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        // console.log("form submit");
    socket.emit('new room', input.value);
    input.value = '';

    socket.emit('client request rooms')
    }
});



socket.on('get rooms', function(games) {
    myRooms = games;

    for (let i = 0; i < myRooms.length; i++) {
        // logging game room info
        // console.log(myRooms[i].room)
        // console.log(myRooms[i].p1)
        // console.log(myRooms[i].p2)
        // console.log(myRooms[i].moves)

        const newGame = document.createElement("div");
        newGame.textContent = (`Room: ${myRooms[i].room} | P1: ${myRooms[i].p1} | P2: ${myRooms[i].p2} | moves: ${myRooms[i].moves}`)
        activeGames.appendChild(newGame);
    }
    


});

socket.on('update room', function(newDetails) {

    for (let i = 0; i < myRooms.length; i++) {
        // logging game room info
        console.log(newDetails[i].room)
        console.log(newDetails[i].p1)
        console.log(newDetails[i].p2)
        console.log(newDetails[i].moves)
    }

});

// testing stuff to run when the page loads
// socket.emit('join room', "test-room"); 
socket.emit('client request rooms')
