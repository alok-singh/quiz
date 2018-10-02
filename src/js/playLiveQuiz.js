import React from 'react';
import ReactDOM from 'react-dom';
import PlayLiveQuizComponent from '../components/playQuiz/playLiveQuizComponent';

let quizPin = document.getElementById('data').innerHTML;
ReactDOM.render(<PlayLiveQuizComponent quizPin={quizPin} />, document.getElementById('root'));