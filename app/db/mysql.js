/**
 * MySQL
 */
console.log("Initialize MySQL");
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 100, // Default 10
  host : "127.0.0.1",
  database: "roster",
  user : "roster",
  multipleStatements: true,
  password: "roster"
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
    if(err)	{
      throw err;
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
