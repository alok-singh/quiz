import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import ScoreBoardComponent from './scoreBoardComponent';
import QuestionComponent from './questionComponent';
import ResultScreenComponent from '../common/resultScreenComponent';

const selectedColor = '#2e9e0f';

export default class PlayQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPercent: 0,
            isLoading: true,
            isScoreActive: false, // show is player correct
            isQuestionActive: false, 
            isResultRunning: false,  // leaderboard
            currentQuestionNumber: 1,
            totalQuestions: 10,
            isPlayerCorrect: false,
            playerScore: 'NA',
            roundBest: 'NA',
            playerTotalScore: 'NA',
            playerRank: 'NA',
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
            questionObject: {},
            currentTimeout: 10,
            resultList: []
        }

        this.onClickAnswer = this.onClickAnswer.bind(this);

        if(typeof window !== 'undefined'){
            window.quizComponent = this;
        }
    }

    eventHandler() {
        this.socket = io();
        this.socket.on('broadcast', (data) => {
            if(data && data.action == 'question'){
                this.setState({
                    isQuestionActive: true,
                    isLoading: false,
                    isScoreActive: false,
                    isResultRunning: false,
                    questionObject: data.question,
                    totalQuestions: data.total_questions,
                    currentTimeout: data.question.question_time
                }, () => {
                    this.startClock();
                })
            }
            else if(data && data.action == 'result'){
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isScoreActive: true,
                    isResultRunning: false,
                    playerList: data.users
                });
            }
            else if(data && data.action == 'leaderBoard'){
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isScoreActive: false,
                    isResultRunning: true,
                    resultList: data.users
                });
            }
        });
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
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        
        if(apiToken && sessionKey){
            this.timeout = setInterval(() => {
                let loadingPercent = parseInt(this.state.loadingPercent) + parseInt(50*Math.random());
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
            this.eventHandler();
        }
        else{
            location.href = '/login';
        }
    }

    startClock() {
        this.interval = setInterval(() => {
            let remainingTime = this.state.currentTimeout - 1;
            if(remainingTime <= 0){
                remainingTime = 0;
                clearTimeout(this.interval);
            }
            this.setState({
                currentTimeout: remainingTime,
                isAnsweringAllowed: !(remainingTime <= 0)
            }, () => {
                
                if(remainingTime <= 0){
                    let apiToken = sessionStorage.apitk;
                    let sessionKey = sessionStorage.bqsid;
                    let answeredOption = this.state.questionObject.options.filter(option => {
                        return option.is_answer
                    })[0];
                    let data = {
                        quiz_id: this.props.quizID,
                        question_id: this.state.questionObject.question_id,
                        quiz_pin: this.props.quizPin,
                        option_id: answeredOption ? answeredOption.option_id : null
                    };
                    post(`/api/player/answer/`, data, {
                        authorization: apiToken
                    }).then(data => {
                        this.setState({
                            isPlayerCorrect: data.correct
                        });
                    });
                }

            });
        }, 1000);
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
            let data = JSON.stringify({
                quizID: this.props.quizID,
                quizPin: this.props.quizPin
            })
            return <span id='data' style={{display: 'none'}}>{data}</span>
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

    renderResultScreen() {
        if(this.state.isResultRunning){
            return <ResultScreenComponent resultList={this.state.resultList} />
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
            {this.renderResultScreen()}
        </div>
    }

}