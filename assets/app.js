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
}

var player2 = {
    guess: null,
    score: null,
}

var ties = null
var p1s = player1.score
var p2s = player2.score
var p1g = player1.guess
var p2g = player2.guess

function play(a, b) {
    if (a === b) {
        return tie()
    }

    if (a === 'paper') {
        if (b === 'rock') {
            return oneWins()
        } else {
            return twoWins()
        }
    }

    if (a === 'scissors') {
        if (b === 'paper') {
            return oneWins()
        } else {
            return twoWins()
        }
    }

    if (a === 'rock') {
        if (b === 'scissors') {
            return oneWins()
        } else {
            return twoWins()
        }
    }

}

function oneWins() {
    p1s++
    p1g = null
    p2g = null
    console.log('player one wins')
    database.ref().set({
        playerOneGuess: p1g,
        playerTwoGuess: p2g,
        playerOneScore: p1s,
        playerTwoScore: p2s,
        ties: ties
    })
    
}

function twoWins() {
    p2s++
    p1g = null
    p2g = null
    console.log('player two wins')
    database.ref().set({
        playerOneGuess: p1g,
        playerTwoGuess: p2g,
        playerOneScore: p1s,
        playerTwoScore: p2s,
        ties: ties
    })
}

function tie() {
    ties++
    p1g = null
    p2g = null
    console.log('there was a tie')
    database.ref().set({
        playerOneGuess: p1g,
        playerTwoGuess: p2g,
        playerOneScore: p1s,
        playerTwoScore: p2s,
        ties: ties
    })

}

database.ref().on("value", function (snapshot) {

    if (snapshot.child('playerOneGuess').exists()) {
        p1g = snapshot.val().playerOneGuess  
    }
    if (snapshot.child('playerTwoGuess').exists()) {
        p2g = snapshot.val().playerTwoGuess  
    }
    if (snapshot.child('playerOneScore').exists()) {
        p1s = snapshot.val().playerOneScore
    }
    if (snapshot.child('playerTwoScore').exists()) {
        p2s = snapshot.val().playerTwoScore
    }
    if (snapshot.child('ties').exists()) {
        ties = snapshot.val().ties
    }

    if (snapshot.child('playerOneGuess').exists() && snapshot.child('playerTwoGuess').exists()) {
        return play(snapshot.val().playerOneGuess, snapshot.val().playerTwoGuess)
    }
})



$('.p1b').on('click', (e) => {
    p1g = e.target.innerText
    console.log('player 1: ' + p1g)
    database.ref().set({
        playerOneGuess: p1g,
        playerTwoGuess: p2g,
        playerOneScore: p1s,
        playerTwoScore: p2s,
        ties: ties
    })
})

$('.p2b').on('click', (e) => {
    p2g = e.target.innerText
    console.log('player 2: ' + p2g)
    database.ref().set({
        playerOneGuess: p1g,
        playerTwoGuess: p2g,
        playerOneScore: p1s,
        playerTwoScore: p2s,
        ties: ties
    })
})

//when player makes choice set their decision
//if there are two guesses playgame() inside of global data listener
//if player wins set their wins/score inside global data listener
// set the js variables to null inside of global data listener

//multiplayer
//player1 function and player2 function
//if someone clicks player1 button then it sets fb variable that tells p2 they are p2


//reset varibles 

