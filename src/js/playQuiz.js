import React from 'react';
import ReactDOM from 'react-dom';
import PlayQuizComponent from '../components/playQuiz/playQuizComponent';

let quizID = document.getElementById('data').innerHTML;
ReactDOM.render(<PlayQuizComponent quizID={quizID} />, document.getElementById('root'));