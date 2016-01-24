/**
 * Socket IO Chat connections
 */
module.exports = {
  io: null,
  mysql: null,
  
  init: function(io, mysql) {
    console.log("Chat Socket IO initialized");
    module.exports.io = io;
    module.exports.mysql = mysql;
  },
  
  chat: function(json) {
    var strQuery = "SELECT * FROM users";	
    module.exports.mysql.query( strQuery, [], function(err, rows) {
      if(err)	{
        throw err;
      } else {
        //console.log( rows );
      }
    });
    
    module.exports.io.emit('chat message', json);
  }
}
