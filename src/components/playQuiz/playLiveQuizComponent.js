import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import ScoreBoardComponent from './scoreBoardComponent';
import QuestionComponent from './questionComponent';

const selectedColor = '#2e9e0f';

export default class PlayQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPercent: 0,
            isLoading: true,
            isScoreActive: false,
            isQuestionActive: false,
            currentQuestionNumber: 1,
            totalQuestions: 10,
            isPlayerCorrect: false,
            playerScore: 302,
            roundBest: 120,
            playerTotalScore: 984,
            playerRank: 3,
            playerList: [{
                name: 'Alok',
                rank: 1,
                score: 120,
                isCorrect: true
            }, {
                name: 'Janny',
                rank: 2,
                score: 110,
                isCorrect: false
            }],
            isAnsweringAllowed: true,
            questionObject: {
                "options": [
                {
                    "option_title": "National Aeronautical Space Agency",
                    "option_id": 49
                },
                {
                    "option_title": "National Aeronautical Space Agency",
                    "option_id": 51
                },
                {
                    "option_title": "National Aeronautical Space Agency",
                    "option_id": 52
                },
                {
                    "option_title": "National Aeronautical Space Agency",
                    "option_id": 50
                }],
                "question_title": "What is the form of NASA?",
                "question_id": 19,
                "question_image": "",
                "question_time": 10
            },
            currentTimeout: 10

        }

        this.onClickAnswer = this.onClickAnswer.bind(this);

        if(typeof window !== 'undefined'){
            window.quizComponent = this;
        }
    }

    eventHandler() {
        /* 
            io is available via socket.io.js 
            it is automatically serverby socket.io to the client
        */
        this.socket = io();

        this.socket.on('broadcast', (data) => {
            
        });

        this.socket.emit('update', Object.assign({}, {

        }));
    }

    onClickAnswer(optionIndex) {
        if(this.state.isAnsweringAllowed){
            let {questionObject} = this.state;
            let options = questionObject.options.map(val => {
                return {
                    option_title: val.option_title,
                    option_id: val.option_id
                }
            });
            options[optionIndex].is_answer = true;
            questionObject.options = options;
            this.setState({
                questionObject
            });
        }
    }

    componentDidMount() {
        this.timeout = setInterval(() => {
            let loadingPercent = parseInt(this.state.loadingPercent) + parseInt(10*Math.random());
            if(loadingPercent >= 100){
                clearInterval(this.timeout);
                loadingPercent = 100;
            }
            if(this.state.isLoading){
                this.setState({
                    loadingPercent: loadingPercent
                });
            }
        }, 1000);
    }

    componentDidUpdate() {
        if(this.state.isQuestionActive && this.state.currentTimeout){
            this.timeout = setTimeout(() => {
                let remainingTime = this.state.currentTimeout - 1;
                if(remainingTime <= 0){
                    remainingTime = 0;
                    clearTimeout(this.timeout);
                }
                this.setState({
                    currentTimeout: remainingTime,
                    isAnsweringAllowed: !(remainingTime <= 0)
                });
            }, 1000);
        }
    }

    renderLoadingScreen() {
        if(this.state.isLoading){
            return <LoadingScreenComponent loaded={this.state.loadingPercent} />
        }
        else{
            return null;
        }
    }

    renderHiddenData() {
        if(typeof window == 'undefined'){
            return <span id='data' style={{display: 'none'}}>{this.props.quizPin}</span>
        }
        else{
            return null;
        }
    }

    renderScoreBoard() {
        if(this.state.isScoreActive){
            return <ScoreBoardComponent 
                currentQuestionNumber={this.state.currentQuestionNumber}
                totalQuestions={this.state.totalQuestions}
                isPlayerCorrect={this.state.isPlayerCorrect}
                playerScore={this.state.playerScore}
                roundBest={this.state.roundBest}
                playerTotalScore={this.state.playerTotalScore}
                playerRank={this.state.playerRank}
                playerList={this.state.playerList}
            />
        }
        else{
            return null;
        }
    }

    renderQuestion() {
        if(this.state.isQuestionActive){
            return <QuestionComponent 
                questionObject={this.state.questionObject}
                currentQuestion={this.state.currentQuestionNumber}
                totalQuestions={this.state.totalQuestions}
                currentTimeout={this.state.currentTimeout}
                onClickAnswer={this.onClickAnswer}
            />
        }
        else{
            return null;
        }
    }

    render() {
        return <div className="main">
            {this.renderLoadingScreen()}
            {this.renderHiddenData()}
            {this.renderScoreBoard()}
            {this.renderQuestion()}
        </div>
    }

}