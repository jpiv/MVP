var socket = io(), team, role, spys, limit;

// Socket.io
socket.on('begin round', function(data){
  $('.begin').fadeOut();
  $('#response').fadeIn();

  if(data.score){ 
  $('#boardbutton').fadeIn();

  var lastRound = data.score[0].length
  $('#board').append($('<div>')
    .text('Round :' + lastRound + ', Successes: ' + data.score[0][lastRound - 1][0] + ', Fails: ' + data.score[0][lastRound - 1][1])
    .addClass('user'));
    if(data.score[1][0] > 2){
      $('#boardbutton').text('Knights of the Round Win!')
    } else if(data.score[1][1] > 2){
      $('#boardbutton').text('Spies Win!')
    } else { 
      $('#boardbutton').text(data.score[1][0] + ' missions succeeded, ' + data.score[1][1] + ' missions failed')
    }
  }
  
  if(data.role){
    role = data.role;
    $('#role').text(role);
    $('#rolebutton').fadeIn();
  }
  
  if(data.spys){
    $('#spiesbutton').fadeIn();
    for (var i = 0; i < data.spys.length; i++) {
    $('#spies').append($('<div>')
      .text(data.spys[i])
      .addClass('user'));
    }
  }

  limit = data.limit;
  spys = data.spys || null;
  team = {};
  console.log(limit);
  $('#users').empty();

  for (var j = 0; j < data.users.length; j++) {
    $('#users').append($('<div>')
      .text(data.users[j])
      .addClass('user')
      .on('click', function(){
        $(this).toggleClass('selected');
        team = {};
        $('.selected').each(function(user){
          team[$(this).text()] = 0;
        });
        if(Object.keys(team).length === data.limit){
          $('.team').fadeIn();
        } else {
          $('.team').fadeOut();
        }
      }));
  }
});

socket.on('voting', function(sentTeam){
  $('.team').fadeOut();
  $('#users').empty();
  for (var i = 0; i < sentTeam.length; i++) {
    $('#users').append($('<div>')
      .text(sentTeam[i])
      .addClass('user'));
  }
  $('#teamSend').fadeOut();
  $('.vote').fadeIn();
});

socket.on('run', function(sentTeam){
  $('.run').fadeIn();
});

// jQuery
$('#rolebutton').on('click', function(){
  $('#role').slideToggle();
});

$('#spiesbutton').on('click', function(){
  $('#spies').slideToggle();
});

$('#boardbutton').on('click', function(){
  $('#board').slideToggle();
});

$('#join').on('submit', function(){
  console.log('SENT')
  $('h1').fadeOut();
  $('.join').fadeOut('fast', function(){
    $('.begin').fadeIn();
  });
  socket.emit('join', $('#username').val());
  return false;
});

$('.begin button').on('click', function(){
  // $('.begin').fadeOut();
  $('#boaedbutton').fadeIn();
  socket.emit('begin game');
});

$('.team').on('click', function(){
  socket.emit('team', Object.keys(team));
});

$('#yes').on('click', function(){
  $('.vote').fadeOut();
  $('#users').empty();
  socket.emit('voteTeam', 'yes');
});

$('#no').on('click', function(){
  $('.vote').fadeOut();
  socket.emit('voteTeam', 'no');
});

$('#succeed').on('click', function(){
  $('.run').fadeOut();
  socket.emit('run mission', 'yes');
});

$('#fail').on('click', function(){
  if(role === 'Spy'){
    $('.run').fadeOut();
    socket.emit('run mission', 'no');
  }
});