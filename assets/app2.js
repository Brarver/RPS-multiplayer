var firebaseConfig = {
    apiKey: "AIzaSyBIe1rUGxPObHXcPuEnosFkv3GMTGLhDGA",
    authDomain: "rockps-1603a.firebaseapp.com",
    databaseURL: "https://rockps-1603a.firebaseio.com",
    projectId: "rockps-1603a",
    storageBucket: "",
    messagingSenderId: "114744099457",
    appId: "1:114744099457:web:1df429af2d7ebe7c"
  }

firebase.initializeApp(firebaseConfig)

var database = firebase.database()

var game = database.ref('/game')
var players = database.ref('/players')
var chat = database.ref('/chat')

var player1
var player2
var you
var p1w = 0
var p2w = 0
var p1l = 0
var p2l = 0
var p1g = null
var p2g = null
var playerOneKey = undefined
var playerTwoKey = undefined
var connectionKey = undefined

//////////////////////////////////////Connections////////////////////////////////////////////////////////////////

var connectionsRef = database.ref("/connections")
var connectedRef = database.ref(".info/connected")


connectedRef.on("value", function(snap) {
	
	if (snap.val() === true) {
        var con = connectionsRef.push()
		connectionKey = con.key

		con.onDisconnect().remove(function(err) {
			if(err) {
				console.log("There was an error removing a user: %s", err)
			}
		})

		con.set(true)
	}
});

connectionsRef.on("value", function(snap) {
    console.log('All keys: %o', snap.val());  

	var AllKeys = snap.val();

	if(((playerOneKey !== undefined) && (playerOneKey.length)) &&
	   ((playerTwoKey !== undefined) && (playerTwoKey.length))) {

		if(AllKeys !== undefined) {
			var playerOneConnected = AllKeys.hasOwnProperty(playerOneKey)
			var playerTwoConnected = AllKeys.hasOwnProperty(playerTwoKey)

			var bothPlayersConnected = (playerOneConnected && playerTwoConnected)
			if(!bothPlayersConnected) {
				
                resetGame();
			}
		}
	}
});

/////////////////////////////////////set players//////////////////////////////////////////////

$('#add-player').on('click', function() {
    if (!playerOneKey) {
        player1 = $('#player-name').val().trim()
        $('#player-name').hide()
        $('#add-player').hide()
        $('.designation').append(player1 + ' you are player 1')
        you = 'one'
        players.set({
            player1: player1,
			playerOneKey: connectionKey
        })

    } else if (!playerTwoKey) {
        player2 = $('#player-name').val().trim()
        $('#player-name').hide()
        $('#add-player').hide()
        $('.designation').append(player2 + ' you are player 2')
        you = 'two'
        players.set({
            player1: player1,
            player2: player2,
			playerOneKey: playerOneKey,
			playerTwoKey: connectionKey
        })
    }
})

players.on('value', function(snapshot) {
	console.log("%o", snapshot.val());

    if (snapshot.exists()) {
        player1 = snapshot.val().player1
        player2 = snapshot.val().player2
		playerOneKey = snapshot.val().playerOneKey;
		playerTwoKey = snapshot.val().playerTwoKey;
        $('#player-1-name').text(player1)
        $('#player-2-name').text(player2)
    }

    if (snapshot.child('player2').exists()) {
        console.log('initial')
        renderOne()
    }

})

/////////////////////////////////////////game//////////////////////////////////////////////////////////////////


game.on("value", function (snapshot) {

    if (!snapshot.child('playerOneGuess').exists() && playerTwoKey) {
        renderOne()
    }
    if (snapshot.child('playerOneGuess').exists() && playerOneKey && playerTwoKey) {
        p1g = snapshot.val().playerOneGuess  
        renderTwo()
    }
    if (snapshot.child('playerTwoGuess').exists()) {
        p2g = snapshot.val().playerTwoGuess  
    }
    if (snapshot.child('playerOneWin').exists()) {
        p1w = snapshot.val().playerOneWin
    }
    if (snapshot.child('playerOneLoss').exists()) {
        p1l = snapshot.val().playerOneLoss
    }
    if (snapshot.child('playerTwoWin').exists()) {
        p2w = snapshot.val().playerTwoWin
    }
    if (snapshot.child('playerTwoLoss').exists()) {
        p2l = snapshot.val().playerTwoLoss
    }

    if (snapshot.child('playerOneGuess').exists() && snapshot.child('playerTwoGuess').exists()) {
        return play(snapshot.val().playerOneGuess, snapshot.val().playerTwoGuess)
    }
})

function resetGame() {
    players.remove();
    game.remove()
    chat.remove()
    $('.chat-text').empty()
    $('.score').empty()
    $('.designation').empty()
    $('#player-name').show().val('')
    $('#add-player').show()
    $('.board').empty()
    alert('A player has left. Game Over!')
    p1w = 0
    p1l = 0
    p2w = 0
    p2l = 0
    playerOneKey = "";
    playerTwoKey = "";
    $("#player-1-name").text("Waiting for player 1");
    $("#player-2-name").text("Waiting for player 2");
    $(".items1").empty();
    $(".items2").empty();
    renderOne()
    
}


function renderOne() {
    console.log('renderOne')
    $('.items1').empty()
    $('.items2').empty()

    if (playerOneKey && playerTwoKey) {
    $('.board').text('Game in Progress')
    renderWins()
    var s = $('<div>').text('waiting on player 1 to choose')
    $('.items2').append(s)
    
    
    var items = ['rock', 'paper', 'scissors']

    if (you === 'one') {
        console.log('renderOne if one')
        for (var i = 0; i < items.length; i++) {
            var div = $('<div>').addClass('item p1b')
            div.text(items[i])
            $('.items1').append(div)
            
        }
        playerOneChoose()
    }
  }
}

function renderTwo() {
    console.log('renderTwo')
    var items = ['rock', 'paper', 'scissors']
    $('.items1').empty()
    $('.items2').empty()

    if (playerOneKey && playerTwoKey) {
        $('.board').text('Game in Progress')
        renderWins()
        var p = $('<div>').text('waiting on player 2 to choose')
        $('.items1').append(p)
    
    

    if (you === 'two') {
        console.log('renderTwo if two')
        for (var i = 0; i < items.length; i++) {
            var div = $('<div>').addClass('item p2b')
            div.text(items[i])
            $('.items2').append(div)
        }
        playerTwoChoose()
    } 
  }  
}

function renderWins() {
    $('.wins-losses1').text('Wins: ' + p1w + ' Losses: ' + p1l)
    $('.wins-losses2').text('Wins: ' + p2w + ' Losses: ' + p2l)
}

function renderGuess() {
    $('.items1').empty()
    $('.items2').empty()
    $('.items1').text(p1g)
    $('.items2').text(p2g)
}

function playerOneChoose() {
    console.log('playerOneChoose')

    $('.p1b').on('click', (e) => {
        p1g = e.target.innerText
        console.log('playerOneChoose click')
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneWin: p1w,
            playerOneLoss: p1l,
            playerTwoWin: p2w,
            playerTwoLoss: p2l
        }) 
    })    
}

function playerTwoChoose() {
    console.log('PlayerTwoChoose')

    $('.p2b').on('click', (e) => {
        console.log('playerTwoChoose click')
        p2g = e.target.innerText
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneWin: p1w,
            playerOneLoss: p1l,
            playerTwoWin: p2w,
            playerTwoLoss: p2l
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
    p1w++
    p2l++
    renderGuess()
    renderWins()
    $('.board').text(player1 + ' Wins!')
    setTimeout(function newGame() {
        $('.board').text('Game in Progress')
        p1g = null
        p2g = null
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneWin: p1w,
            playerOneLoss: p1l,
            playerTwoWin: p2w,
            playerTwoLoss: p2l
        })
    }, 3000)
    
    
}

function twoWins() {
    p2w++
    p1l++
    renderGuess()
    renderWins()
    $('.board').text(player2 + ' Wins!')

    setTimeout(function newGame() {
        $('.board').text('Game in Progress')
        p1g = null
        p2g = null
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneWin: p1w,
            playerOneLoss: p1l,
            playerTwoWin: p2w,
            playerTwoLoss: p2l
        })
    }, 3000)
    
}

function tie() {
    renderGuess()
    $('.board').text('There was a tie')
    setTimeout(function newGame() {
        p1g = null
        p2g = null
        $('.board').text('Game in Progress')
        game.set({
            playerOneGuess: p1g,
            playerTwoGuess: p2g,
            playerOneWin: p1w,
            playerOneLoss: p1l,
            playerTwoWin: p2w,
            playerTwoLoss: p2l
        })
    }, 3000)
}

////////////////////////////////Chat////////////////////////////////////////////////////////

$('.submit-text').on('submit', function(e) {
    e.preventDefault()
    var comment = $('.comment').val()
    $('.comment').val('')
    console.log(comment)
    if (you === 'one' && playerTwoKey) {
        chat.push({
            comment: player1 + ': ' + comment
        })
    } else if (you === 'two' && playerTwoKey) {
        chat.push({
            comment: player2 + ': ' + comment
        })
    }
})

chat.on('child_added', function(childSnapShot) {
    console.log(childSnapShot.val().comment)
    var children = $('.chat-text').children().length

    $('.chat-text').append("<div class='chat-line'>" + childSnapShot.val().comment)

    if (children > 5) {
        $('.chat-text').children().first().remove()
    }

  


})


// TODO(rick): Move this down with the other game play related functions. It is
// only here to keep it close to the other changes.
// NOTE(rick): Take as arguments the "connected" status of each player. This
// helps us determine which player left and how to properly "reset" and update
// the UI.
// function ResetGame(playerOneConnected, playerTwoConnected)
// {
// 	if(playerOneConnected && !playerTwoConnected)
// 	{
// 		playerTwoExists = false;
// 		playerTwoKey = "";
// 		$("#player-2-name").text("Waiting for player 2 to join");
// 		$(".items2").empty();
//         players.set({
//             player1: player1,
//             player2: "",
//             playerOneExists: playerOneExists,
//             playerTwoExists: playerTwoExists,
// 			playerOneKey: playerOneKey,
// 			playerTwoKey: playerTwoKey
//         })
//         game.remove()
// 	}
	
// 	else if(playerTwoConnected && !playerOneConnected)
// 	{
// 		playerOneExists = false;
// 		playerOneKey = "";
// 		$("#player-1-name").text("Waiting for player 1 to join");
// 		$(".items1").empty();
//         players.set({
//             player1: "",
//             player2: player2,
//             playerOneExists: playerOneExists,
//             playerTwoExists: playerTwoExists,
// 			playerOneKey: playerOneKeyundefined,
// 			playerTwoKey: playerTwoKey
//         })
//         game.remove()
// 	}
	
// 	else
// 	{
// 		playerOneExists = false;
// 		playerTwoExists = false;
// 		playerOneKey = "";
// 		playerTwoKey = "";
// 		$("#player-1-name").text("Waiting for player 1");
// 		$("#player-2-name").text("Waiting for player 2");
// 		$(".items1").empty();
// 		$(".items2").empty();
//         players.remove();
//         game.remove()
// 	}
// }


//from add-player click
// NOTE(rick): This user has added themselves to the game, store
			// their connection key into the players document. Later one when
			// someone joins their instance of the app will be able to know who
			// the players are and behave as expected.

