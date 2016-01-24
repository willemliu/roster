/**
 * RosterIO module
 */
define([
  'jquery',
  'socketio'
], function($, io) {
  var instance = null;
  
  function RosterIO(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one RosterIO, use RosterIO.getInstance()");
    }
  }

  RosterIO.prototype = {
    init: function() {
      console.log('Initialize RosterIO');
      var socket = io();
      
      $(document).on("change", ".cell-edit input, .cell-edit select", function(){
        var json = JSON.stringify($(".cell-edit form").serializeArray());
        socket.emit('edit cell', JSON.parse(json));
        return false;
      });

      $(document).on("change", ".row-edit input, .row-edit select", function(){
        var json = JSON.stringify($(".row-edit form").serializeArray());
        socket.emit('edit row', JSON.parse(json));
        return false;
      });

      socket.on('edit cell', $.proxy(this.editCell, this));
      socket.on('edit row', $.proxy(this.editRow, this));
    },
    
    editCell: function(json) {
      var date;
      var userId;
      var free = '';
      var freeClass = "";

      for(var idx in json) {
        if(json[idx].name == 'data-date') {
          date = json[idx].value;
        } else if(json[idx].name == 'data-user-id') {
          userId = json[idx].value;
        } else if(json[idx].name == 'free') {
          free = json[idx].value;
        }
      }
      if(free == 1) {
        freeClass = "half";
      } else if(free > 1) {
        freeClass = "free";
      }
      var cell = $("[data-date='" + date + "'][data-user-id='" + userId + "']");
      cell.removeClass("free half");
      cell.addClass(freeClass);
    },
    
    editRow: function(json) {
      var date;
      var free = '';
      var freeClass = "";

      for(var idx in json) {
        if(json[idx].name == 'data-date') {
          date = json[idx].value;
        } else if(json[idx].name == 'free') {
          free = json[idx].value;
        }
      }
      if(free == 1) {
        freeClass = "half";
      } else if(free > 1) {
        freeClass = "free";
      }
      var cell = $("[data-date='" + date + "'][data-user-id]");
      cell.removeClass("free half");
      cell.addClass(freeClass);
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new RosterIO();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new RosterIO();
});
