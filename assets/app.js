var firebaseConfig = {
    apiKey: "AIzaSyBIe1rUGxPObHXcPuEnosFkv3GMTGLhDGA",
    authDomain: "rockps-1603a.firebaseapp.com",
    databaseURL: "https://rockps-1603a.firebaseio.com",
    projectId: "rockps-1603a",
    storageBucket: "",
    messagingSenderId: "114744099457",
    appId: "1:114744099457:web:1df429af2d7ebe7c"
  };

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var player1 = {
    guess: null,
    score: null,
    wins: null
}

var player2 = {
    guess: null,
    score: null,
    wins: null
}

var ties = null
var p1s = player1.score
var p2s = player2.score
var p1g = player1.guess
var p2g = player2.guess

function play(a, b) {
    if (a === b) {
        ties++
    }

    if (a === 'paper') {
        if (b === 'rock') {
            p1s++
        } else {
            p2s++
        }
    }

    if (a === 'scissors') {
        if (b === 'paper') {
            p1s++
        } else {
            p2s++
        }
    }

    if (a === 'rock') {
        if (b === 'scissors') {
            p1s++
        } else {
            p2s++
        }
    }

}

$('.p1b').on('click', (e) => {
    p1g = e.target.innerText
    console.log('player 1: ' + p1g)
    database.ref().push({
        playerOneGuess: p1g
    })
})

$('.p2b').on('click', (e) => {
    p2g = e.target.innerText
    console.log('player 2: ' + p2g)
    database.ref().push({
        playerTwoGuess: p2g
    })
})

//when player makes choice set their decision
//if there are two guesses playgame() inside of global data listener
//if player wins set their wins/score inside global data listener
// set the js variables to null inside of global data listener

//multiplayer
//player1 function and player2 function
//if someone clicks player1 button then it sets fb variable that tells p2 they are p2

