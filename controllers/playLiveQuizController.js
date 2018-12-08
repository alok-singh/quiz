import React from 'react';
import {renderToString} from 'react-dom/server';
import PlayLiveQuizComponent from '../src/components/playQuiz/playLiveQuizComponent';
import PlayLivePollComponent from '../src/components/playQuiz/playLivePollComponent';


export const playLiveQuizController = (req, res) => {
	let {quizID, quizPin, pollID, pollPin} = req.params;
	let stringComponent = (quizID && quizPin) ? renderToString(<PlayLiveQuizComponent quizID={quizID} quizPin={quizPin} />) : renderToString(<PlayLivePollComponent pollID={pollID} pollPin={pollPin} />)
	res.render('common', {
		pageTitle: 'BrainItOn Live quiz',
		jsPath: '/build/js/playLiveQuiz.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: stringComponent
	});
}