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
          6, 0, 0 // ...at 06:00:00 hours
      );
      var msTillMidnight = night.getTime() - now.getTime();
      console.log(night, msTillMidnight);
      setTimeout(function() {
        window.location.reload();
      }, msTillMidnight);
    },
    
    addListeners: function() {
      $(document).on("click", ".tbody [data-user-id]", $.proxy(this.showCellEdit, this));
      $(document).on("click", ".thead [data-user-id]", $.proxy(this.showColEdit, this));
      $(document).on("click", ".edit-row", $.proxy(this.showRowEdit, this));
      $(document).on("click", ".edit-box .close", function() {
        $(".edit-box").hide();
      });
      // Escape key to close edit boxes.
      $(document).keyup(function(e) {
        if (e.keyCode == 27) $(".edit-box").hide();   // esc
      });
    },
    
    showColEdit: function(e) {
      $(".edit-box").hide();
      this.showEditBox(e, '.column-edit');
      $(".column-edit [name='data-user-id']").val($(e.currentTarget).attr('data-user-id'));
      var today = new Date();
      var nextMonth = new Date();
      nextMonth.setMonth(today.getMonth()+1);
      $('.column-edit input[type="date"]').each(function() {
        $(this).get(0).valueAsDate = today;
      });
      $('.column-edit input[name="end-date"]').get(0).valueAsDate = nextMonth;
      
      $('.column-edit').removeClass('rtl');
      $('.column-edit.point-right').each(function() {
        $(this).addClass('rtl');
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
    
    /**
     * Calculate where to open the edit box.
     * Edit box must fit inside viewport and point to the cell which activated it.
     */
    showEditBox: function (e, selector) {
      var xOffset = 0;
      var yOffset = 0;
      var jEditBox = $(selector);
      var jCell = $(e.currentTarget);
      var posX = jCell.offset().left + jCell.outerWidth();
      var posY = jCell.offset().top + jCell.outerHeight();
      
      // The popup must stay within viewport
      if((posX + jEditBox.outerWidth()) > $(window).width()) {
        xOffset = jEditBox.outerWidth() + jCell.outerWidth();
        jEditBox.removeClass("point-left");
        jEditBox.addClass("point-right");
      } else {
        jEditBox.addClass("point-left");
        jEditBox.removeClass("point-right");
      }
      if((posY + jEditBox.outerHeight()) > $(window).height()) {
        yOffset = jEditBox.outerHeight() + jCell.outerHeight();
        jEditBox.addClass("point-bottom");
      } else {
        jEditBox.removeClass("point-bottom");
      }
      
      jEditBox.css({top: posY - yOffset, left: posX - xOffset});
      jEditBox.show();
    },
    
    /**
     * Use the data from the cell to fill out the form in the edit box.
     * Makes sure that it reflects the current state of the cell.
     */
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
    
    /**
     * Use the data from the cells in the row to fill out the form in the edit box.
     * Makes sure that it reflects the current state of the cell.
     */
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
