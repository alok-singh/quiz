import api from '../service/api';
import socket from 'socket.io';

let io = {};

export const createConnection = (server) => {
	io = socket(server);
	io.on('connection', (client) => {	  	
	  	client.on('disconnect', (data) => {
	  		console.log('disconnected', data);
	  	});
	});
}


export const gatewayPostController = (req, res) => {
	api.post(req.url, req.body, req.headers).then((response) => {
		let url = req.url;
		if(url.indexOf('/api/seminar/') !== -1 && url.indexOf('start') !== -1){
			io.emit('broadcast', response.body); // emit an event to all connected sockets
		}
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}

export const gatewayGetController = (req, res) => {
	api.get(req.url, req.headers).then((response) => {
		let url = req.url;
		if(url.indexOf('/api/seminar/') !== -1 && url.indexOf('start') !== -1){
			io.emit('broadcast', response.body); // emit an event to all connected sockets
		}
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}



// use this when player adding is done bty websocket

/*client.on('update', (data) => { // listen to the event
	console.log('update');
	console.log(data);
});*/