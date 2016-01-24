/**
 * Roster Socket IO connections
 */
module.exports = {
  io: null,
  mysql: null,

  init: function(io, mysql) {
    module.exports.io = io;
    module.exports.mysql = mysql;
  },
  
  editCell: function(json) {
    var date;
    var userId;
    var free = 0;

    for(var idx in json) {
      if(json[idx].name == 'data-date') {
        date = json[idx].value;
      } else if(json[idx].name == 'data-user-id') {
        userId = parseInt(json[idx].value);
      } else if(json[idx].name == 'free') {
        free = json[idx].value;
      }
    }
    
    var dataArray = [];
    dataArray.push(userId);
    dataArray.push(free);
    dataArray.push(new Date(date));
    dataArray.push(free);
    var strQuery = "INSERT IGNORE INTO users_dates (user_id, free, dt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE free=?";
    module.exports.mysql.query( strQuery, dataArray, function(err, rows) {
      if(err)	{
        throw err;
      } else {
        console.log( rows );
      }
    });
    
    module.exports.io.emit('edit cell', json);
  }, 
  
  editRow: function(json) {
    var date;
    var free = 0;

    for(var idx in json) {
      if(json[idx].name == 'data-date') {
        date = json[idx].value;
      } else if(json[idx].name == 'free') {
        free = json[idx].value;
      }
    }
    
    var dataArray = [];
    dataArray.push(free);
    dataArray.push(new Date(date));
    dataArray.push(free);
    var strQuery = "INSERT IGNORE INTO users_dates (user_id, free, dt) SELECT DISTINCT id, ?, ? FROM users ON DUPLICATE KEY UPDATE free=?";
    module.exports.mysql.query( strQuery, dataArray, function(err, rows) {
      if(err)	{
        throw err;
      } else {
        console.log( rows );
      }
    });
    
    module.exports.io.emit('edit row', json);
  }  
}