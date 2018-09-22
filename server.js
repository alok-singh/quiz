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
import {gatewayPostController, gatewayGetController} from './controllers/apiController';
import {addQuestionController} from './controllers/addQuestionController';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/Templates'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/login', (req, res) => {
	loginController(req, res);
});

app.get('/quiz', (req, res) => {
	quizController(req, res);
});

app.get('/quiz/:quizID/edit', (req, res) => {
	addQuestionController(req, res);
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

app.get('/images/*', function(req, res) {
	let filePath = path.resolve("./images" + decodeURI(req.url.split("images").pop()));
	getFileFromPath(filePath, res, {
		'Content-Type': 'image/jpg', 
		'Cache-Control': 'public, max-age=31557600'
	});
});

app.get('/home', (req, res) => {
	homeController(req, res);
});

app.get('/player-home', (req, res) => {
	playerHomeController(req, res);
});

app.get('/create', (req, res) => {
	createQuizController(req, res);
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

const getFileFromPath = (filePath, res, contentType)  => {
	fs.readFile(filePath, function(err, data){
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

http.createServer(app).listen(3000);
console.log("server started in port 3000");