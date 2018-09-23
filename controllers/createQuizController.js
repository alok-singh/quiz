import React from 'react';
import {renderToString} from 'react-dom/server';
import CreateQuizController from '../src/components/createQuiz/createQuizComponent';


export const createQuizController = (req, res) => {
	res.render('common', {
		pageTitle: 'Quiz',
		jsPath: './build/js/createQuiz.bundle.js',
		cssPath: './build/css/host.css',
		innerHTML: renderToString(<CreateQuizController />)
	});
}