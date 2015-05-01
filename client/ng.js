function openSocket($rootScope){
  var socket = io();
  return {
    on: function(event, callback){
      socket.on(event, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          callback(socket, args);
        });
      });
    },
    emit: function(event, data, callback){
      socket.emit(event, data, function(){
        var args = arguments;
        $rootScope.$apply(function(data){
          if(callback){
            callback.apply(socket, data, args);
          }
        });
      });
    }
  }
};


function control($scope, socket){
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



angular.module('resist', [])
.controller('mainCrtl', )
.factory('socket', openSocket($rootScope));