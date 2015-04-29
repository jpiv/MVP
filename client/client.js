var socket = io(), team, role, spys, limit;

// Socket.io
socket.on('begin round', function(data){
  $('.begin').hide();

  if(data.score){ 
  var lastRound = data.score.length
  $('#board').append($('<div>')
    .text('Round :' + lastRound + ', Successes: ' + data.score[lastRound - 1][0] + ', Fails: ' + data.score[lastRound - 1][1])
    .addClass('user'));
  }
  
  if(data.role){
    role = data.role;
    $('#role').text(role);
    $('#rolebutton').show();
  }
  
  if(data.spys){
    $('#spiesbutton').show();
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
          $('.team').show();
        } else {
          $('.team').hide();
        }
      }));
  }
});

socket.on('voting', function(sentTeam){
  $('.team').hide();
  $('#users').empty();
  for (var i = 0; i < sentTeam.length; i++) {
    $('#users').append($('<div>')
      .text(sentTeam[i])
      .addClass('user'));
  }
  $('#teamSend').hide();
  $('.vote').show();
});

socket.on('run', function(sentTeam){
  $('.run').show();
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

$('#join').on('click', function(){
  $('.join').fadeOut('fast', function(){
    $('.begin').fadeIn();
  });
  socket.emit('join', $('#username').val());
});

$('.begin button').on('click', function(){
  $('.begin').hide();
  socket.emit('begin game');
});

$('.team').on('click', function(){
  socket.emit('team', Object.keys(team));
});

$('#yes').on('click', function(){
  $('.vote').hide();
  $('#users').empty();
  socket.emit('voteTeam', 'yes');
});

$('#no').on('click', function(){
  $('.vote').hide();
  socket.emit('voteTeam', 'no');
});

$('#succeed').on('click', function(){
  $('.run').hide();
  socket.emit('run mission', 'yes');
});

$('#fail').on('click', function(){
  if(role === 'spy'){
    $('.run').hide();
    socket.emit('run mission', 'no');
  }
});