var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var port = process.env.PORT || 3000 // begin listening

http.listen(port, function(){
  console.log("we're always listening!");
});

// ================================
// router
// ================================

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/client/style.css', function(req, res){
  res.sendFile(__dirname + '/client/style.css');
});

app.get('/client/client.js', function(req, res){
  res.sendFile(__dirname + '/client/client.js');
});

app.get('/client/logo.png', function(req, res){
  res.sendFile(__dirname + '/client/logo.png');
});

// ================================
// settings
// ================================

// set game object
var startGame = function(){
  return {
    players: {},
    team: [],
    rounds: [],
    votes: [],
    spys: [],
    count: 0,
    yes: 0,
    no: 0,
    yeses: [],
    nos: [],
    pass: 0,
    fail: 0,
    failedTeam: 0
  }
};
var game = startGame();
// ================================
// socket.io
// ================================

io.sockets.on('connect', function(player){


  var calcLimit = function(){
    var perfectGame = Object.keys(game.players).length - game.spys.length;
    var round = game.rounds.length + 1;
    if(round === 1){
      return perfectGame - 2;
    } else if(round < 4) {
      return perfectGame - 1;
    } else {
      return perfectGame;
    }
  };

  // when a player joins
  player.on('join', function(username){
    game.players[username] = [];
    game.players[username][0] = player;
    game.count++;
  });

  // when the game begins
  player.on('begin game', function(){
    var deck = [];
    var spy = Math.ceil(game.count / 2 - 1);
    var i = 0;

    // create deck
    while(i < game.count){
      if(i < spy){
        deck.push('Spy');
      } else if(i === spy) {
        deck.push('Merlin');
      } else {
        deck.push('Knight of the Round');
      }
      i++;
    }

    // shuffle deck
    deck = _.shuffle(deck);
    
    // deal deck
    for(var name in game.players){
      if(game.players[name]){
        game.players[name].push(deck.pop());
        if(game.players[name][1] === 'Spy'){
          game.spys.push(name);
        }
      }
    }

    // send rolls and spy list where necessary
    for(var name2 in game.players){
      if(game.players[name2]){
        var data = {
          role: game.players[name2][1],
          users: Object.keys(game.players),
          limit: calcLimit()
        };
        if(data.role === 'Spy' || data.role === 'Merlin'){
          data.spys = game.spys;
        }
        game.players[name2][0].emit('begin round', data);
      }
    }
  });

  // when a team is proposed, ask for a vote
  player.on('team', function(team){
    game.team = team;
    console.log(team);
    io.emit('voting', team);
  });

  // tally votes when recieved
  player.on('voteTeam', function(vote){
    if(vote === 'yes'){
      game.yeses.push(player);
      game.yes++;
    } else {
      game.nos.push(player);
      game.no++;
    }
    if(game.yes + game.no === game.count){
      if(game.yes >= game.no){
        game.failedTeam = 0;
        for (var i = 0; i < game.team.length; i++) {
          game.players[game.team[i]][0].emit('run', game.team);
        }
      } else {
        game.failedTeam++;
        io.sockets.emit('begin round', { users: Object.keys(game.players), limit: calcLimit()});
      }
      game.yes = 0;
      game.no = 0;
    }
  });

  // when the mission is run, decide fail or pass
  player.on('run mission', function(run){
    if(run === 'yes'){
      game.yes++;
    } else {
      game.no++;
    }
    if(game.yes + game.no === game.team.length){
      game.rounds.push([game.yes, game.no]);
      console.log(game.rounds, game.pass, game.fail);
      if(game.no !== 0){
        game.fail++;
        if(game.fail === 3){
          console.log('LOST');
        }
        io.sockets.emit('fail')
        console.log('fail!', [game.yes, game.no]);
      } else {
        game.pass++;
        if(game.pass === 3){
          console.log('WON!');
        }
        console.log('pass!');
      }

      game.yes = 0;
      game.no = 0;
      if(game.fail === 3){
        console.log('LOST');
      }
      if(game.rounds.length < 5){
        console.log('begin new round');
        io.sockets.emit('begin round', { users: Object.keys(game.players), limit: calcLimit(), score: [game.rounds, [game.pass, game.fail]] });
      }
    }
  });

  // disconnect listener
  player.on('disconnect', function(){
    game.count--;
    console.log(game.count)
    if(game.count < 1){
      game = startGame();
    }
    for(var name in game.players){
      if(game.players[name] && game.players[name][0] === player){
        delete game.players[name];
      }
    }
  });
});