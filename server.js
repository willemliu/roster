var express   = require('express');
var app       = express();
var mysql     = require('./app/db/mysql');
var http      = require('http').Server(app);
var fs        = require('fs'); // bring in the file system api
var mustache  = require('mustache'); // bring in mustache template engine
var io        = require('socket.io')(http);
var roster    = require('./app/socketio/roster')(io, mysql);

io.on('connection', function(socket) {
  console.log('User connected to SocketIO');
  socket.on('edit cell', roster.editCell);
  socket.on('edit row', roster.editRow);

  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
});


require('./app/controllers/static')(app, express);
require('./app/controllers/roster')(app, fs, mustache, mysql);

/**
 * Start the HTTP server
 */
var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log(`listening on *:${port}`);
});

