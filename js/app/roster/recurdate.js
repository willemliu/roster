/**
 * RecurDate module
 */
define([
  'jquery'
], function($) {
  var instance = null;
  
  function RecurDate(){
    if(instance !== null){
      throw new Error("Cannot instantiate more than one RecurDate, use RecurDate.getInstance()");
    }
  }

  RecurDate.prototype = {
    init: function() {
      console.log("Initialzed RecurDate");
    },
    
    /**
     * Proces rules set in json.
     * Returns list of all matching dates.
     */
    processRules: function(json) {
      var userId;
      var startDate = new Date();
      var endDate = new Date();
      var free = 0;
      var outOfOffice = 0;
      var supportDuty = 0;
      var weekInterval = 1;
      var days = [];
      for(var idx in json) {
        if(json[idx].name == 'data-user-id') {
          userId = json[idx].value;
        } else if(json[idx].name == 'free') {
          free = json[idx].value;
        } else if(json[idx].name == 'out-of-office') {
          outOfOffice = json[idx].value;
        } else if(json[idx].name == 'support-duty') {
          supportDuty = json[idx].value;
        } else if(json[idx].name == 'start-date') {
          startDate = new Date(json[idx].value);
        } else if(json[idx].name == 'end-date') {
          endDate = new Date(json[idx].value);
        } else if(json[idx].name == 'recur-week') {
          weekInterval = json[idx].value;
        } else if(json[idx].name == 'recur-day[]') {
          days.push(parseInt(json[idx].value));
        }
      }
      
      var dates = this.processDates(startDate, endDate, days, weekInterval);
      var results = [];
      for(var idx2 in dates) {
        results.push([
          {
            "name" : "data-user-id",
            "value" : userId
          },
          {
            "name" : "data-date",
            "value" : dates[idx2]
          },
          {
            "name" : "out-of-office",
            "value" : outOfOffice
          },
          {
            "name" : "support-duty",
            "value" : supportDuty
          },
          {
            "name" : "free",
            "value" : free
          }
        ]);
      }
      return results;
    },
    
    /**
     * Traverses between the given start and end dates and validates if conforms rules
     * set by days (Array) and weekInterval (int).
     */
    processDates: function(startDate, endDate, days, weekInterval) {
      var result = [];
      var dt = new Date(startDate);
      while(dt.getTime() < endDate.getTime()) {
        if($.inArray(dt.getDay(), days) === 0) {
          result.push(new Date(dt));
        }
        dt.setDate(dt.getDate()+1); // Increment 1 day
      }
      return result;
    },
    
    getInstance: function() {
      if(instance === null) {
        instance = new RecurDate();
        this.init();
      }
      return instance;
    }
    
  };
  
  return instance||new RecurDate();
});
