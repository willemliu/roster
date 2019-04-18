/**
 * RosterIO module
 * Handling edits and updates
 */
define([
  'jquery',
  'socketio',
  'app/roster/recurdate'
], function($, io, RecurDate) {
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
        appInsights.trackEvent("Edit Cell");
        return false;
      });

      $(document).on("change", ".row-edit input, .row-edit select", function(){
        var json = JSON.stringify($(".row-edit form").serializeArray());
        socket.emit('edit row', JSON.parse(json));
        appInsights.trackEvent("Edit Row");
        return false;
      });

      $(document).on("click", ".column-edit input[type='submit']", function(){
        if(!confirm("This will overwrite any existing settings on the matching days")) {
          return;
        }
        
        var json = JSON.stringify($(".column-edit form").serializeArray());
        var dates = RecurDate.getInstance().processRules(JSON.parse(json));
        for(var idx in dates) {
          socket.emit('edit cell', dates[idx]);
        }
        appInsights.trackEvent("Edit multiple");        
        return false;
      });

      socket.on('edit cell', $.proxy(this.editCell, this));
      socket.on('edit row', $.proxy(this.editRow, this));
    },
    
    editCell: function(json) {
      var result = this.processSocketIOmsg(json);
      var cell = $("[data-date='" + (new Date(result.date)).toDateString() + "'][data-user-id='" + result.userId + "']");
      this.removeAllSpecialClasses(cell);
      cell.addClass(result.cssClasses);
      cell.attr('data-groups', result.groups);
      $(EVENT_BUS).trigger('rosterio.editCell:done');
    },
    
    editRow: function(json) {
      var result = this.processSocketIOmsg(json);
      var cell = $("[data-date='" + (new Date(result.date)).toDateString() + "'][data-user-id]");
      cell.removeClass("free half");
      cell.addClass(result.cssClasses);
      cell.attr('data-groups', result.groups);
      $(EVENT_BUS).trigger('rosterio.editRow:done');
    },
    
    removeAllSpecialClasses: function(el) {
      $(el).removeClass("free half out-of-office support-duty");
      $('.group').each(function() {
        $(el).removeClass($(this).attr('data-group-name'));
      });

    },
    
    /**
     * Convenience function processes input and returns directly usable values.
     *
     * Output
     * { date: date, userId: userId, cssClasses: cssClasses, ...etc }
     */
    processSocketIOmsg: function(json) {
      var date;
      var userId;
      var cssClasses = [];
      var groups = [];

      for(var idx in json) {
        if(json[idx].name == 'data-date') {
          date = json[idx].value;
        } else if(json[idx].name == 'data-user-id') {
          userId = json[idx].value;
        } else if(json[idx].name == 'free') {
          cssClasses.push(this.isFree(json[idx].value));
        } else if(json[idx].name == 'out-of-office' && json[idx].value > 0) {
          cssClasses.push(json[idx].name);
        } else if(json[idx].name == 'support-duty' && json[idx].value > 0) {
          cssClasses.push(json[idx].name);
        } else if(json[idx].name == 'group[]') {
          console.log(json[idx].name, json[idx].value);
          cssClasses.push(json[idx].value);
          groups.push(json[idx].value);
        }
      }
      
      return {
        date: date,
        userId: userId,
        cssClasses: cssClasses.join(' '),
        groups: groups.join(' ')
      };
    },
    
    /**
     * Can return free or half or an empty string.
     * Input
     * 0: at work
     * 1: half a day off
     * 2: full day off
     *
     * Output
     * - 'free': entire day off
     * - 'half': half a day off
     * - '': at working
     */
    isFree: function(free) {
      if(free == 1) {
        return "half";
      } else if(free > 1) {
        return "free";
      }
      return '';
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
