export const webSocketController = (io) => {
	io.on('connection', (client) => {
	  	client.on('update', (data) => { // listen to the event
	  		io.emit('broadcast', this.status); // emit an event to all connected sockets
	  	});
	  	client.on('disconnect', () => {
	  		console.log('disconnected');
	  	});
	});
}
