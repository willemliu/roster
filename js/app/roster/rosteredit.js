/**
 * RosterEdit module
 */
define([
  'jquery',
  'app/roster/rosterio'
], function($, RosterIO) {
  var instance = null;
  
  function RosterEdit(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one RosterEdit, use RosterEdit.getInstance()");
    }
  }

  RosterEdit.prototype = {
    init: function() {
      console.log('Initialize RosterEdit');
      RosterIO.getInstance();
      this.addListeners();
      this.reloadNextDay();
    },
    
    reloadNextDay: function() {
      var now = new Date();
      var night = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1, // the next day, ...
          0, 0, 0 // ...at 00:00:00 hours
      );
      var msTillMidnight = night.getTime() - now.getTime();
      console.log(night, msTillMidnight);
      setTimeout(function() {
        window.location.reload();
      }, msTillMidnight);
    },
    
    addListeners: function() {
      $(document).on("click", "[data-user-id]", $.proxy(this.showCellEdit, this));
      $(document).on("click", ".edit-row", $.proxy(this.showRowEdit, this));
      $(document).on("click", ".edit-box .close", function() {
        $(".edit-box").hide();
      });
    },
    
    showRowEdit: function(e) {
      $(".edit-box").hide();
      this.showEditBox(e, '.row-edit');
      var el = e.currentTarget;      
      this.initRowEditCheckboxes(el);
    },
    showCellEdit: function(e) {
      $(".edit-box").hide();
      this.showEditBox(e, '.cell-edit');
      var el = e.currentTarget;      
      this.initCellEditCheckboxes(el);
    },
    
    showEditBox: function (e, selector) {
      var xOffset = 0;
      var yOffset = 0;
      var jEditBox = $(selector);
      // The popup must stay within viewport
      if((e.pageX + jEditBox.outerWidth()) > $(window).width()) {
        xOffset = jEditBox.outerWidth();
        jEditBox.removeClass("point-left");
        jEditBox.addClass("point-right");
      } else {
        jEditBox.addClass("point-left");
        jEditBox.removeClass("point-right");
      }
      if((e.pageY + jEditBox.outerHeight()) > $(window).height()) {
        yOffset = jEditBox.outerHeight();
        jEditBox.addClass("point-bottom");
      } else {
        jEditBox.removeClass("point-bottom");
      }
      
      jEditBox.css({top: e.pageY - yOffset, left: e.pageX - xOffset});
      jEditBox.show();
    },
    
    initCellEditCheckboxes: function(el) {
      var free = 0;
      if($(el).hasClass('free')) {
        free = 2;
      } else if($(el).hasClass('half')) {
        free = 1;
      }
      
      $(".cell-edit [name='free']").val(free);
      
      $(".cell-edit [name='out-of-office']").prop("checked", ($(el).hasClass('out-of-office'))?'checked':'');
      $(".cell-edit [name='support-duty']").prop("checked", ($(el).hasClass('support-duty'))?'checked':'');
      
      $(".cell-edit [name='data-date']").val($(el).attr('data-date'));
      $(".cell-edit [name='data-user-id']").val($(el).attr('data-user-id'));
    },
    
    initRowEditCheckboxes: function(el) {
      var free = 0;
      $("[data-user-id][data-date='" + $(el).attr('data-date') + "']").each(function() {
        if($(this).hasClass('free')) {
          free = 2;
          return false;
        } else if($(this).hasClass('half')) {
          free = 1;
        }
      });
      $(".row-edit [name='free']").val(free);
      $(".row-edit [name='data-date']").val($(el).attr('data-date'));
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new RosterEdit();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new RosterEdit();
});
