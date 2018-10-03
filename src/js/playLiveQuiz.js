import React from 'react';
import ReactDOM from 'react-dom';
import PlayLiveQuizComponent from '../components/playQuiz/playLiveQuizComponent';

let data = JSON.parse(document.getElementById('data').innerHTML);
let {quizID, quizPin} = data;

ReactDOM.render(<PlayLiveQuizComponent quizID={quizID} quizPin={quizPin} />, document.getElementById('root'));