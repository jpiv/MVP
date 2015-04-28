var socket = io(), team, role, spys, limit;

// Socket.io
socket.on('begin round', function(data){
  $('#begin').hide();
    
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

  for (var i = 0; i < data.users.length; i++) {
    $('#users').append($('<div>')
      .text(data.users[i])
      .addClass('user')
      .on('click', function(){
        $(this).toggleClass('selected');
        team = {};
        $('.selected').each(function(user){
            team[$(this).text()] = 0;
        });
        if(Object.keys(team).length === data.limit){
          $('#teamSend').show();
        } else {
          $('#teamSend').hide();
        }
      }));
  };
});

socket.on('voting', function(sentTeam){
  $('#users').empty();
  for (var i = 0; i < sentTeam.length; i++) {
    $('#users').append($('<div>')
      .text(sentTeam[i])
      .addClass('user'));
  };
  $('#teamSend').hide();
  $('.vote').show();
});

socket.on('run', function(sentTeam){
  $('.run').show();
});

// jQuery
$('#rolebutton').on('mouseenter', function(){
  $('#role').show();
});
$('#rolebutton').on('mouseleave', function(){
  $('#role').hide();
});

$('#spiesbutton').on('mouseenter', function(){
  $('#spies').show();
});
$('#spiesbutton').on('mouseleave', function(){
  $('#spies').hide();
});

$('#join').on('click', function(){
  $('.join').hide();
  socket.emit('join', $('#username').val());
});

$('#begin').on('click', function(){
  socket.emit('begin game');
});

$('#teamSend').on('click', function(){
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