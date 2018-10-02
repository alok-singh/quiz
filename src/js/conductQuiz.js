import React from 'react';
import ReactDOM from 'react-dom';
import ConductQuizComponent from '../components/conductQuiz/conductQuizComponent';

let data = JSON.parse(document.getElementById('data').innerHTML);
let {quizID, quizPin} = data;

ReactDOM.render(<ConductQuizComponent quizID={quizID} quizPin={quizPin} />, document.getElementById('root'));