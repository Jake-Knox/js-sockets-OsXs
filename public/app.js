var socket = io();

let myRooms = []

// document variables
const activeGames = document.getElementById("active-games");


socket.on('get rooms', function(games) {
    myRooms = games;

    for (let i = 0; i < myRooms.length; i++) {
        // logging game room info
        console.log(myRooms[i].room)
        console.log(myRooms[i].p1)
        console.log(myRooms[i].p2)
        console.log(myRooms[i].moves)

        const newGame = document.createElement("li");
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

//
socket.emit('join room', "test-room"); 
