/**
 * Groups module
 */
define([
  'jquery'
], function($) {
  var instance = null;
  
  function Groups(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one Groups, use Groups.getInstance()");
    }
  }

  Groups.prototype = {
    init: function() {
      console.log('Initialize Groups');
      $(EVENT_BUS).on('rosterio.editCell:done rosterio.editRow:done', $.proxy(this.hideCells, this));
      this.hideCells();
    },
    
    hideCells: function() {
      $(".tbody .td:not(:first-child)").css('visibility', 'visible');
      if(this.getQueryVariable('group')) {
        $(".tbody .td:not(:first-child):not('." + this.getQueryVariable('group') + "')").css('visibility', 'hidden');
      }
    },
    
    getQueryVariable: function(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
      }
      return(false);
    },

    getInstance: function() {
      if(instance === null) {
        instance = new Groups();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new Groups();
});
