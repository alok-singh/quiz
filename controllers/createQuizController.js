import React from 'react';
import {renderToString} from 'react-dom/server';
import CreateQuizComponent from '../src/components/createQuiz/createQuizComponent';

export const createQuizController = (req, res) => {
	let isPoll = req.url == '/create-poll';
	res.render('common', {
		pageTitle: 'Quiz',
		jsPath: '/build/js/createQuiz.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<CreateQuizComponent isPoll={isPoll} />)
	});
}