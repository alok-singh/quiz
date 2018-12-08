import React from 'react';
import ReactDOM from 'react-dom';
import AddQuestionComponent from '../components/createQuiz/addQuestionComponent';

let dataQuizEl = document.getElementById('dataQuiz');
let dataPollEl = document.getElementById('dataPoll');
let quizID = dataQuizEl ? dataQuizEl.innerHTML : undefined;
let pollID = dataPollEl ? dataPollEl.innerHTML : undefined;

ReactDOM.render(<AddQuestionComponent quizID={quizID} pollID={pollID} />, document.getElementById('root'));