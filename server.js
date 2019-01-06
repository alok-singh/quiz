'use strict';

import http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import {createQuizController} from './controllers/createQuizController';
import {loginController} from './controllers/loginController';
import {homeController} from './controllers/homeController';
import {playerHomeController} from './controllers/playerHomeController';
import {playQuizController} from './controllers/playQuizController';
import {playLiveQuizController} from './controllers/playLiveQuizController';
import {gatewayPostController, gatewayGetController, createConnection, gatewayDeleteController} from './controllers/apiController';
import {addQuestionController} from './controllers/addQuestionController';
import {conductQuizController} from './controllers/conductQuizController';
import {hostMyResultController} from './controllers/hostMyResultController';


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/login', (req, res) => {
	requestPassway(req, res, loginController);
});

app.get('/quiz/:quizID/edit', (req, res) => {
	requestPassway(req, res, addQuestionController);
});

app.get('/poll/:pollID/edit', (req, res) => {
	requestPassway(req, res, addQuestionController);
});

app.get('/home', (req, res) => {
	requestPassway(req, res, homeController);
});

app.get('/player-home', (req, res) => {
	requestPassway(req, res, playerHomeController);
});

app.get('/my-results', (req, res) => {
	requestPassway(req, res, hostMyResultController);
});

app.get('/play/quiz/:quizID', (req, res) => {
	requestPassway(req, res, playQuizController);
});

app.get(['/play/live/:quizID/:quizPin', '/play/poll/:pollID/:pollPin'], (req, res) => {
	requestPassway(req, res, playLiveQuizController);
});

app.get(['/create', '/create-poll'], (req, res) => {
	requestPassway(req, res, createQuizController);
});

app.get(['/conduct/live/:quizID/:quizPin/','/conduct/poll/:pollID/:pollPin/'], (req, res) => {
	requestPassway(req, res, conductQuizController);
});

app.get('/build/*', (req, res) => {
	let filePath = "." + req.url;
	let contentType = req.url.split('.').pop();
	if(contentType == 'css'){
		contentType = {'Content-Type': 'text/css'}
	}
	else{
		contentType = {'Content-Type': 'application/javascript'};
	}
	getFileFromPath(filePath, res, contentType);
});

app.get('/images/*', (req, res) => {
	let filePath = path.resolve("./images" + decodeURI(req.url.split("images").pop()));
	getFileFromPath(filePath, res, {
		'Content-Type': 'image/jpg', 
		'Cache-Control': 'public, max-age=31557600'
	});
});

app.get('/api/*', (req, res) => {
	gatewayGetController(req, res);
});

app.get('/*', (req, res) => {
	sendTo404(res);
});

app.post('/api/*', (req, res) => {
	gatewayPostController(req, res);
});

app.delete('/api/*', (req, res) => {
	gatewayDeleteController(req, res);
})

const requestPassway = (req, res, controller) => {
	try{
		controller(req, res);
	}
	catch(err) {
		sendTo404(res);
	}
}

const getFileFromPath = (filePath, res, contentType)  => {
	fs.readFile(filePath, (err, data) => {
		if(err){
			sendTo404(res);
		}
		else{
			res.writeHead(200, contentType);
			res.write(data);
			res.end();
		}
	});
}

const sendTo404 = (res) => {
	res.writeHead(404, {'Content-Type': 'text'});
	res.write("404 Not found");
	res.end();
}


// *********************** server start ************************** //

const server = http.createServer(app);
createConnection(server);
server.listen(3000);
console.log("server started in port 3000");




