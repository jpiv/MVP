var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

// create route to index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

// set settings object
var settings = {
  players: {},
  team: [],
  rounds: [],
  votes: [],
  spys: [],
  count: 0,
  yes: 0,
  no: 0,
  pass: 0,
  fail: 0
};

// connect to sockets
io.sockets.on('connect', function(player){


  // when a player joins
  player.on('join', function(username){
    settings.players[username] = [];
    settings.players[username][0] = player;
    settings.count++;
  });

  // when the game begins
  player.on('begin', function(){
    var deck = [];
    var spy = Math.ceil(settings.count / 2 - 1);
    var i = 0;

    // create deck
    while(i < settings.count){
      if(i < spy){
        deck.push('spy');
      } else if(i === spy) {
        deck.push('merlin');
      } else {
        deck.push('loyal');
      }
      i++;
    }

    // shuffle deck
    deck = _.shuffle(deck);
    
    // deal deck
    for(var name in settings.players){
      if(settings.players[name]){
        settings.players[name].push(deck.pop());
        if(settings.players[name][1] === 'spy'){
          settings.spys.push(name);
        }
      }
    }

    // send rolls and spy list where necessary
    for(var name in settings.players){
      var data = {
        roll: settings.players[name][1],
        users: Object.keys(settings.players)
      };
      if(data.roll === 'spy' || data.roll === 'merlin'){
        data.spys = settings.spys;
      }
      console.log(data);
      settings.players[name][0].emit('begin', data);
    }
  });


  // when a team is proposed, ask for a vote
  player.on('team', function(team){
    console.log(team);
    io.emit('voting');
  });

  // tally votes when recieved
  player.on('voteTeam', function(vote){
    if(vote === 'yes'){
      settings.yes++;
    } else {
      settings.no++;
    };
    if(settings.yes + settings.no === settings.count){
      if(settings.yes >= settings.no){
        console.log('pass!');
      } else {
        console.log('fail')
      }
      settings.yes = 0;
      settings.no = 0;
    }
  });

  // when the mission is run, decide fail or pass
  player.on('runMission', function(run){
    if(run === 'yes'){
      settings.yes++;
    } else {
      settings.no++;
    };
    if(settings.yes + settings.no === team.length){
      settings.rounds.push([settings.yes, settings.no]);
      if(settings.no !== 0){
        settings.fail++;
        if(settings.fail === 3){
          console.log('LOST');
        }
        console.log('fail!', [settings.yes, settings.no]);
      } else {
        settings.pass++;
        if(settings.pass === 3){
          console.log('WON!');
        }
        console.log('pass!');
      }
      settings.yes = 0;
      settings.no = 0;
    };
    if(settings.rounds.length < 5){
      io.emit('begin');
    }
  });

  // disconnect listener
  player.on('disconnect', function(){
    for(var name in settings.players){
      if(settings.players[name] && settings.players[name][0] === player){
        settings.players[name] = null;
      }
    }
  });
});

// begin listening
http.listen(2000, function(){
  console.log("we're always listening!");
});