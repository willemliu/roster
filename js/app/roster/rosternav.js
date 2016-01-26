/**
 * RosterNav module
 */
define([
  'jquery'
], function($) {
  var instance = null;
  
  function RosterNav(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one RosterNav, use RosterNav.getInstance()");
    }
  }

  RosterNav.prototype = {
    init: function() {
      console.log('Initialize RosterNav');
      $(document).on("click", ".previousPeriod", function(){
        var firstDate = new Date($("[data-date]").first().attr("data-date"));
        firstDate.setDate(firstDate.getDate() - 30);
        window.location = '/roster/' + firstDate.toDateString();
      });

      $(document).on("click", ".nextPeriod", function(){
        var lastDate = new Date($("[data-date]").last().attr("data-date"));
        window.location = '/roster/' + lastDate.toDateString();
      });
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new RosterNav();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new RosterNav();
});
