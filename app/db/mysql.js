/**
 * MySQL
 */
console.log("Initialize MySQL");
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10, // Default 10
  host : "127.0.0.1",
  database: "willim_roster",
  user : "willim_roster",
  multipleStatements: true,
  password: "willim_roster"
});
console.log('MySQL pool created');

/**
 * query - arguments
 * - (REQUIRED) query     : String
 * - (OPTIONAL) dataArray : mixed
 * - (REQUIRED) callback  : function (err, resultSet)
 */
function query() {
  var query = arguments[0];
  var dataArray = [];
  if(arguments.length > 2) {
    dataArray = arguments[1];
  }
  var callback = arguments[arguments.length-1];
  pool.getConnection(function(err, connection) {
    if (err) {
      res.json({"code" : 100, "status" : "Error in connection database"});
      callback(err, null);
      return;
    }
    console.log('MySQL connection id ' + connection.threadId);
    connection.query( query, dataArray, function(err, rows) {
      // And done with the connection. 
      connection.release();
      // Don't use the connection here, it has been returned to the pool. 
      callback(err, rows);
    });
  });
};
exports.query = query;
