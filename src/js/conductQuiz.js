import React from 'react';
import ReactDOM from 'react-dom';
import ConductQuizComponent from '../components/conductQuiz/conductQuizComponent';
import ConductPollComponent from '../components/conductQuiz/conductPollComponent';

let data = JSON.parse(document.getElementById('data').innerHTML);
let {quizID, quizPin, pollID, pollPin} = data;

if(quizID && quizPin){
	ReactDOM.render(<ConductQuizComponent quizID={quizID} quizPin={quizPin} />, document.getElementById('root'));
}
else{
	ReactDOM.render(<ConductPollComponent pollID={pollID} pollPin={pollPin} />, document.getElementById('root'));
}
