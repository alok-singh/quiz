import React from 'react';
import {renderToString} from 'react-dom/server';
import AddQuestionComponent from '../src/components/createQuiz/addQuestionComponent';


export const addQuestionController = (req, res) => {
	res.render('common', {
		pageTitle: 'Home',
		jsPath: '/build/js/addQuestion.bundle.js',
		cssPath: '/build/css/host.css',
		innerHTML: renderToString(<AddQuestionComponent quizID={req.params.quizID} />)
	});
}