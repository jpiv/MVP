      var socket = io();

      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });

      socket.on('begin', function(player){
        console.log(player);
      });

      $('#begin').on('click', function(){
        socket.emit('begin');
      })