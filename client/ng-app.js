app.controller('MainCtrl', ['$scope', 'socket', function($scope, socket){
  $scope.users = [];

  $scope.join = function(username){
    socket.emit('join', username);
    $('#join').fadeOut();
    $('#begin').show();
  };

  $scope.beginGame = function(){
    $('#begin').fadeOut();
    socket.emit('beginGame');
  };

  $scope.submitTeam = function(){
    $('#teamview').fadeOut();
    $('#vote').show();
    socket.emit('submitTeam', team);
  };

  $scope.submitVote = function(){
    $('#vote').fadeOut();
    socket.emit('submitVote', vote);
  };

  $scope.submitRun = function(){
    $('#teamview').fadeOut();
    $('#vote').show();
    socket.emit('submitTeam', team);
  };

  socket.on('begin', function(userlist){
    console.log(userlist);
  });

  socket.on('beginRound', function(team){
    console.log(team);
  });

  socket.on('voting', function(team){
    console.log(team);
  });

  socket.on('running', function(team){
    console.log(team);
  });

  socket.on('succeed', function(){
    console.log('SUCCESS')
  });

  socket.on('fail', function(){
    console.log('FAILURE');
  });

}]);