import React from 'react';
import {renderToString} from 'react-dom/server';
import PlayQuizComponent from '../src/components/playQuiz/playQuizComponent';


export const playQuizController = (req, res) => {
	res.render('common', {
		pageTitle: 'Home',
		jsPath: '/build/js/playQuiz.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<PlayQuizComponent quizID={req.params.quizID} />)
	});
}