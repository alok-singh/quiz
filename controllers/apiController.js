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

export const gatewayDeleteController = (req, res) => {
	api.deleteReq(req.url, req.headers).then(response => {
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}

export const gatewayPostController = (req, res) => {
	api.post(req.url, req.body, req.headers).then((response) => {
		let url = req.url;
		let isQuizStart = (url.indexOf('/api/seminar/') !== -1 && url.indexOf('start') !== -1);
		let isPollStart = (url.indexOf('/api/poll/seminar/') !== -1 && url.indexOf('start') !== -1);
		if(isQuizStart || isPollStart){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'question'}));
		}
		else if(url == '/api/host/question/stats/'){
			io.emit('broadcast', Object.assign({}, response.body, {action: 'result'}));
		}
		else if((url == '/api/host/options/stats/') || (url == '/api/poll/host/options/stats/')){
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
		if((url.indexOf('/api/seminar/') !== -1 || url.indexOf('/api/poll/seminar/') !== -1) && url.indexOf('next_question') !== -1){
			let action = (response.body.quiz_ended || response.body.poll_ended) ? 'leaderBoard' : 'question';
			io.emit('broadcast', Object.assign({}, response.body, {action}));
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