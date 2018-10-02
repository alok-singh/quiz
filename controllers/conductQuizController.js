import React from 'react';
import {renderToString} from 'react-dom/server';
import ConductQuizComponent from '../src/components/conductQuiz/conductQuizComponent';


export const conductQuizController = (req, res) => {
	let {quizID, quizPin} = req.params;
	res.render('common', {
		pageTitle: 'Quiz',
		jsPath: '/build/js/conductQuiz.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<ConductQuizComponent quizID={quizID} quizPin={quizPin}/>)
	});
}