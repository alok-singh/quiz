import React from 'react';
import {renderToString} from 'react-dom/server';
import ConductQuizComponent from '../src/components/conductQuiz/conductQuizComponent';
import ConductPollComponent from '../src/components/conductQuiz/conductPollComponent';


export const conductQuizController = (req, res) => {
	let {quizID, quizPin, pollID, pollPin} = req.params;
	let stringComponent = (quizID && quizPin) ? renderToString(<ConductQuizComponent quizID={quizID} quizPin={quizPin} />) : renderToString(<ConductPollComponent pollID={pollID} pollPin={pollPin} />)
	res.render('common', {
		pageTitle: 'Quiz',
		jsPath: '/build/js/conductQuiz.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: stringComponent
	});
}