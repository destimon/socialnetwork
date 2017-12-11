module.exports = function(io) {

	io.on('connection', function(socket) {
    
    // send connect
    socket.on('connect message', function(msg) {
	    io.emit('connect message', msg);
	    console.log('a user connected');
    });
 
    // send message
    socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
    	console.log(msg);
  	});

    // // send disconnect
    // socket.on('disconnect', function() {
    // 	console.log('disconnected');
    // 	io.emit('disconnected', dismsg);
    // });

  });
};