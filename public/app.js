var socket = io();

const chars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]


let myName = "placeholder_name";
let myRooms = [];
let myGame = [];

// document variables

const formNew = document.getElementById('form-new');
const inputNew = document.getElementById('form-new-input');

const formJoin = document.getElementById('form-join');
const inputJoin = document.getElementById('form-join-input');


const refreshGame = document.getElementById("btn-refresh");
const activeGames = document.getElementById("active-games");

const textP1 = document.getElementById("p1");
const textMoves = document.getElementById("moves");
const textP2 = document.getElementById("p2");

// game board 
const a1 = document.getElementById("a1");
const a2 = document.getElementById("a2");
const a3 = document.getElementById("a3");
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const c1 = document.getElementById("c1");
const c2 = document.getElementById("c2");
const c3 = document.getElementById("c3");

const gameBoardArr = [];
gameBoardArr.push(a1,a2,a3,b1,b2,b3,c1,c2,c3);

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

for(let i = 0; i < gameBoardArr.length; i++)
{
    gameBoardArr[i].addEventListener("click", () => {
        console.log(`click on #${i+1}`);
    })
}

socket.on('get id', function(id) {
    myName = id;
    // console.log(myName);
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

    console.log("updating game details");

    myGame = newDetails;
    // logging game room info
    // console.log(newDetails[i].room)
    // console.log(newDetails[i].p1)
    // console.log(newDetails[i].p2)
    // console.log(newDetails[i].moves)
    // console.log(myGame.board);

    textP1.textContent = (`P1: ${myGame.p1}`);
    textMoves.textContent = (`${myGame.moves}/9`);
    textP2.textContent = (`P2: ${myGame.p2}`);


});




// testing stuff to run when the page loads

// socket.emit('join room', "test-room"); 
// socket.emit('client request rooms')
