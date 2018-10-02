import React from 'react';
import {renderToString} from 'react-dom/server';
import PlayLiveQuizComponent from '../src/components/playQuiz/playLiveQuizComponent';


export const playLiveQuizController = (req, res) => {
	res.render('common', {
		pageTitle: 'BrainItOn Live quiz',
		jsPath: '/build/js/playLiveQuiz.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<PlayLiveQuizComponent quizPin={req.params.quizPin} />)
	});
}