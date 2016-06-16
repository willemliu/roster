/**
 * App module
 */
define([
  'jquery',
  'app/roster/groups',
  'app/roster/rosteredit',
  'app/roster/rosternav'
], function($, Groups, RosterEdit, RosterNav) {
  var instance = null;
  
  function App(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one App, use App.getInstance()");
    }
  }

  App.prototype = {
    init: function() {
      console.log('Initialize app');
      
      Groups.getInstance();
      RosterEdit.getInstance();
      RosterNav.getInstance();
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new App();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new App();
});
