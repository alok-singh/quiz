import React from 'react';
import ReactDOM from 'react-dom';
import PlayLiveQuizComponent from '../components/playQuiz/playLiveQuizComponent';
import PlayLivePollComponent from '../components/playQuiz/playLivePollComponent';

let data = JSON.parse(document.getElementById('data').innerHTML);
let {quizID, quizPin, pollID, pollPin} = data;

if(quizID && quizPin){
	ReactDOM.render(<PlayLiveQuizComponent quizID={quizID} quizPin={quizPin} />, document.getElementById('root'));
}
else{
	ReactDOM.render(<PlayLivePollComponent pollID={pollID} pollPin={pollPin} />, document.getElementById('root'));
}
