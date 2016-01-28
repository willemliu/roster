/**
 * Chat Socket IO connections
 */
var ChatIO = function init(io, mysql) {
  console.log("Chat Socket IO initialized");
  module.exports.io = io;
  module.exports.mysql = mysql;
};

ChatIO.prototype = {
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
};

module.exports = function(io, mysql) {
  return new ChatIO(io, mysql);
};
