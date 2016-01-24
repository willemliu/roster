/**
 * ChatIO module
 */
define([
  'jquery',
  'socketio'
], function($, io) {
  var instance = null;
  
  function ChatIO(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one ChatIO, use ChatIO.getInstance()");
    }
  }

  ChatIO.prototype = {
    init: function() {
      console.log('Initialize ChatIO');
      var socket = io();
      $('#sendButton').on("click", function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });

      socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
      });
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new ChatIO();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new ChatIO();
});
