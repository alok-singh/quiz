import React from 'react';
import ReactDOM from 'react-dom';
import CreateQuizComponent from '../components/createQuiz/createQuizComponent';

let isPoll = location.pathname == '/create-poll';
ReactDOM.render(<CreateQuizComponent isPoll={isPoll} />, document.getElementById('root'));