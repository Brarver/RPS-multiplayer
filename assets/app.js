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

var game = database.ref('/game')
var players = database.ref('/players')

var player1
var player2
var you
var ties = null
var p1s = null
var p2s = null
var p1g = null
var p2g = null
var check = false

//////////////////////////////////////Connections////////////////////////////////////////////////////////////////

var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");


connectedRef.on("value", function(snap) {

  
  if (snap.val()) {

    var con = connectionsRef.push(true);
    
    con.onDisconnect().remove();

  }
});

connectionsRef.on("value", function(snap) {

    console.log(snap.numChildren())

  $("#connected-viewers").text(snap.numChildren());
});


/////////////////////////////////////set players//////////////////////////////////////////////

$('#add-player').on('click', function() {

    if (!player1) {
        player1 = $('#player-name').val().trim()
        $('.info').empty()
        $('.info').text(player1 + ' your are player 1, waiting on player 2')
        you = 'one'
        players.set({
            player1: player1
        })

    } else if (!player2) {
        player2 = $('#player-name').val().trim()
        $('.info').empty()
        $('.info').text(player2 + ' your are player 2')
        you = 'two'
        check = true
        players.set({
            player1: player1,
            player2: player2
        })
    }
})

players.on('value', function(snapshot) {

    if (snapshot.exists()) {
        player1 = snapshot.val().player1
        player2 = snapshot.val().player2
        $('#player-1-name').text(player1)
        $('#player-2-name').text(player2)
    }

    if (snapshot.child('player2').exists()) {
        console.log('bear')
        renderOne()
    }
    
})

/////////////////////////////////////////game//////////////////////////////////////////////////////////////////

function renderOne() {
    check = true
    var items = ['rock', 'paper', 'scissors']

    if (you === 'one') {
        for (var i = 0; i < items.length; i++) {
            var div = $('<div>').addClass('item p1b')
            div.text(items[i])
            $('.items1').append(div)
        }
        playerOneChoose()
    }

    var p = $('<p>').text('waiting on player 1')
    $('.items2').append(p)
    
}

function renderTwo() {
    var items = ['rock', 'paper', 'scissors']

    if (you === 'two') {
        // $('.player2').empty()
        console.log('seal')
        for (var i = 0; i < items.length; i++) {
            var div = $('<div>').addClass('item p2b')
            div.text(items[i])
            $('.items2').append(div)
        }
        playerTwoChoose()
    }
    
    var p = $('<p>').text('waiting on player 2')
    $('items1').append(p)
    
}

game.on("value", function (snapshot) {

    if (!snapshot.child('playerOneGuess').exists() && check) {
        renderOne()
    }

    if (snapshot.child('playerOneGuess').exists()) {
        p1g = snapshot.val().playerOneGuess  
        renderTwo()
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

function playerOneChoose() {
    console.log('deer')

    $('.p1b').on('click', (e) => {
        p1g = e.target.innerText

        console.log('player 1: ' + p1g)
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneScore: p1s,
            playerTwoScore: p2s,
            ties: ties
        }) 
    })    
}

function playerTwoChoose() {
    console.log('elk')

    $('.p2b').on('click', (e) => {
        p2g = e.target.innerText
        // $('.items2').empty()
        console.log('player 2: ' + p2g)
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneScore: p1s,
            playerTwoScore: p2s,
            ties: ties
        })
        
    })
}



///////////////////////////////Game play////////////////////////////////////////////////////
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
    $('.board').text('Player One Wins!')
    game.set({
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
    $('.board').text('Player Two Wins!')
    game.set({
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
    $('.board').text('There was a tie')
    game.set({
        playerOneGuess: p1g,
        playerTwoGuess: p2g,
        playerOneScore: p1s,
        playerTwoScore: p2s,
        ties: ties
    })

}

//when player makes choice set their decision
//if there are two guesses playgame() inside of global data listener
//if player wins set their wins/score inside global data listener
// set the js variables to null inside of global data listener

//multiplayer
//player1 function and player2 function
//if someone clicks player1 button then it sets fb variable that tells p2 they are p2


//reset varibles 

