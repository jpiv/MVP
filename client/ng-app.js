app.controller('MainCtrl', ['$scope', 'socket', function($scope, socket){
  $scope.users = [];

  $scope.join = function(username){
    socket.emit('join', username);
    $('#join').hide();
    $('#begin').show();
  };

  $scope.beginGame = function(){
    $('#begin').hide();
    socket.emit('beginGame');
  };

  $scope.submitTeam = function(){
    $('#teamview').hide();
    $('#vote').show();
    socket.emit('submitTeam', team);
  };

  $scope.submitVote = function(){
    $('#vote').hide();
    socket.emit('submitVote', vote);
  };

  $scope.submitRun = function(){
    $('#teamview').hide();
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