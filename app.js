var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
}); 

var players = {};
var playerCount = 0;
var spys = [];

io.sockets.on('connect', function(player){


  // join listener
  player.on('join', function(username){
    players[username] = [];
    players[username][0] = player;
    playerCount++;
    console.log(players);
  });

  // begin listener
  player.on('begin', function(){
    var deck = [];
    var spy = Math.ceil(playerCount / 2 - 1);
    var i = 0;
    while(i < playerCount){
      if(i < spy){
        deck.push('spy');
      } else if(i === spy) {
        deck.push('merlin');
      } else {
        deck.push('loyal');
      }
      i++;
    }
    deck = _.shuffle(deck);
    
    for(var name in players){
      players[name].push(deck.pop());
      if(players[name][1] === 'spy'){
        spys.push(name);
      }
    }
    console.log(spys);

    for(var name in players){
      var data = {
        roll: players[name][1],
        users: Object.keys(players)
      };
      if(data.roll === 'spy' || data.roll === 'merlin'){
        data.spyList = spys;
      }
      console.log(data);
      players[name][0].emit('begin', data);
    }
  });

  player.on('team', function(){

  });

  player.on('team vote', function(){

  });

  player.on('succeed/fail', function(){

  });

  player.on('succeed', function(){

  });

  // disconnect listener
  player.on('disconnect', function(){
    for(var name in players){
      if(players[name] && players[name][0] === player){
        players[name] = null;
      }
    }
  });
});


/*
- ons:
connect - check
join - check
begin - check
team
team vote
s/f
disconnect

- emits:
begin - check
team
team pass
team fail
mission pass
mission fail




*/


// begin listening

http.listen(3000, function(){
  console.log("we're always listening!");
});