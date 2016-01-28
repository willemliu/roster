/**
 * MySQL
 */
console.log("Initialize MySQL");
var mysql = require('mysql');
var credentials = require('./credentials');
var runningQueue = false;
var queue = [];

var pool = mysql.createPool({
  connectionLimit: 10, // Default 10
  host : credentials.host,
  database: credentials.database,
  user : credentials.user,
  multipleStatements: true,
  password: credentials.password
});
console.log('MySQL pool created');

/**
 * query - arguments
 * - (REQUIRED) query     : String
 * - (OPTIONAL) dataArray : mixed
 * - (REQUIRED) callback  : function (err, resultSet)
 */
function query() {
  queue.push(arguments);
  processQueue();
}

/**
 * Process the queue if there are any items in the queue Array.
 * This function will become available again once the queue has been fully processed (read: emptied).
 * Otherwise the function will simply return.
 */
function processQueue() {
  console.log("Called processQueue");
  if(runningQueue) { 
    console.log("processQueue already running");
    console.log(queue.length, "items left");
    return;
  }
  console.log("Run processQueue");
  runningQueue = true;
  nextInQueue();
}

/**
 * Process the next item in the queue.
 */
function nextInQueue() {
  var nextQuery = queue.shift();
  console.log("Next query");
  console.log(queue.length, "items left");
  executeQuery(nextQuery);
}

/**
 * Execute query in arguments Array:
 * - (REQUIRED) query     : String
 * - (OPTIONAL) dataArray : mixed
 * - (REQUIRED) callback  : function (err, resultSet)
 */
function executeQuery(arguments) {
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
      console.log("MySQL connection closed");
      connection.release();
      // Don't use the connection here, it has been returned to the pool. 
      callback(err, rows);
      
      /**
       * Process next in queue or release queue when done.
       */
      if(queue.length > 0) {
        nextInQueue();
      } else {
        console.log("Finished processing queue");
        runningQueue = false;
      }
    });
  });
}

exports.query = query;
