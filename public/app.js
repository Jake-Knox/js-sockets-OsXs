var socket = io();

const chars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]

let myName = "placeholder_name";
let myRooms = [];
let myGame = [];
let selectedTile = null;

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

const btnSubmit = document.getElementById("btn-submit");

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

refreshGame.addEventListener('click', () => {
    socket.emit('client request rooms');
});

for(let i = 0; i < gameBoardArr.length; i++)
{
    gameBoardArr[i].addEventListener("click", () => {
        // console.log(`click on #${i+1}`);

        let pTurn = (myGame.moves % 2);
        // console.log(`Player turn 0/1: ${pTurn}`);

        if(myName == myGame.p1 && pTurn == 0)
        {
            console.log("p1 click");
            for(let j = 0; j < gameBoardArr.length; j++)
            {
                if(gameBoardArr[j].classList.contains("locked") == false) 
                {
                    gameBoardArr[j].classList = ("game-square no-pick");
                }
            }
            if(gameBoardArr[i].classList.contains("locked") == false)
            {
                gameBoardArr[i].classList = ("game-square O-sel");
                selectedTile = gameBoardArr[i];                  
            } 

        }
        else if(myName == myGame.p2 && pTurn == 1)
        {
            console.log("p2 click");
            for(let j = 0; j < gameBoardArr.length; j++)
            {
                if(gameBoardArr[j].classList.contains("locked") == false)
                {
                    gameBoardArr[j].classList = ("game-square no-pick");
                }
            }
            if(gameBoardArr[i].classList.contains("locked")  == false)
            {
                gameBoardArr[i].classList = ("game-square X-sel");
                selectedTile = gameBoardArr[i];                  
            } 
        }
        else{
            console.log("not my turn");
        }     
    });
}

const selectTile = () => {
     
}


btnSubmit.addEventListener("click", () => {
    // end turn
    // console.log("submit click");
    if(selectedTile != null)
    {
        // .classList.add('MyClass'); .remove .contains .toggle
        // selectedTile.classList.add("locked");
        // selectedTile.style.backgroundColor  = "gray";        
        submitTurn();    
        selectedTile = null;
    }
})

const submitTurn = () => {

    const index = gameBoardArr.indexOf(selectedTile);
    console.log(`tile index: ${index}`);

    socket.emit('submit turn', myGame.room, index);
}


// SOCKET FUNCTIONS

socket.on('get id', function(id) {
    myName = id;
    // console.log(myName);
});

socket.on('get rooms', function(games) {
    myRooms = games;
    activeGames.innerHTML = "";

    for (let i = 0; i < myRooms.length; i++) {

        const newGame = document.createElement("div");
        newGame.textContent = (`${myRooms[i].room} | ${myRooms[i].p1} | ${myRooms[i].p2} | ${myRooms[i].moves}`)

        activeGames.appendChild(newGame);
    }
});

socket.on('update room', function(newDetails) {

    console.log("updating game details");

    myGame = newDetails;

    // console.log(newDetails[i].room)
    // console.log(newDetails[i].p1)
    // console.log(newDetails[i].p2)
    // console.log(newDetails[i].moves)
    // console.log(myGame.board);

    textP1.textContent = (`P1: ${myGame.p1}`);
    textMoves.textContent = (`${myGame.moves}/9`);
    textP2.textContent = (`P2: ${myGame.p2}`);
});

socket.on('room data', (newDetails) => {
    console.log("updating game from end turn");

    myGame = newDetails;

    // console.log(newDetails[i].room)
    // console.log(newDetails[i].p1)
    // console.log(newDetails[i].p2)
    // console.log(newDetails[i].moves)
     console.log(myGame.board);

     // updatign UI
    textMoves.textContent = (`${myGame.moves}/9`);

    for(let i = 0; i < gameBoardArr.length; i++) 
    {
        if(myGame.board[i] != "")
        {
            // const tileContent = document.createElement("p");
            // tileContent.textContent = (`${myGame.board[i]}`);
            gameBoardArr[i].textContent = (`${myGame.board[i]}`);
            if(gameBoardArr[i].textContent == "O")
            {
                gameBoardArr[i].classList = ("game-square O-pick");
            }
            else if (gameBoardArr[i].textContent == "X")
            {
                gameBoardArr[i].classList = ("game-square X-pick");
            }
            gameBoardArr[i].classList.add("locked");
        }        
    }
});

socket.on('end game', () => {
    console.log("game over");
})



// testing stuff to run when the page loads

// socket.emit('join room', "test-room"); 
// socket.emit('client request rooms')
