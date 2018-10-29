import api from '../service/api';
import socket from 'socket.io';

let io = {};

export const createConnection = (server) => {
	io = socket(server);
	io.on('connection', (client) => {	
		console.log('connected client', client.id);  	
	  	client.on('disconnect', (data) => {
	  		console.log('disconnected log', data);
	  	});
	});
}


export const gatewayPostController = (req, res) => {
	api.post(req.url, req.body, req.headers).then((response) => {
		let url = req.url;
		if(url.indexOf('/api/seminar/') !== -1 && url.indexOf('start') !== -1){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'question'}));
		}
		else if(url == '/api/host/question/stats/'){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'result'}));
		}
		else if(url == '/api/host/quiz/stats/'){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'leaderBoard'}));
		}
		else if(url == '/api/host/options/stats/'){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'statsBoard'}));
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
		if(url.indexOf('/api/seminar/') !== -1 && url.indexOf('next_question') !== -1){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'question'}));
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