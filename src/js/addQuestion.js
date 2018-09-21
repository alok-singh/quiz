import React from 'react';
import ReactDOM from 'react-dom';
import AddQuestionComponent from '../components/createQuiz/addQuestionComponent';

let quizID = document.getElementById('data').innerHTML;
ReactDOM.render(<AddQuestionComponent quizID={quizID} />, document.getElementById('root'));