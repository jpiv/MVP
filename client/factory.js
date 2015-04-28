
var app = angular.module('resist', [])

app.factory('socket', function($rootScope){
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
});