// 1. Make express session authorization
// 2. Connect, Disconnect channels
// 3. Send Message channel
// 4. Set Contacts list
// 5. Establishe ajax with message history

'use strict';

module.exports = function(io) {

  let connections = [];

	io.on('connection', function(socket) {
    connections.push(socket);
    console.log(connections.length);
    console.log(socket.request);


    socket.on('disconnect', function() {
      connections.splice(connections.indexOf(socket), 1);
      console.log(connections.length);
    });
  });
};