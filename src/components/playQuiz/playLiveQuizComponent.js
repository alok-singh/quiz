import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import ScoreBoardComponent from './scoreBoardComponent';
import QuestionComponent from './questionComponent';
import ResultScreenComponent from '../common/resultScreenComponent';
import StatsComponent from '../common/statsComponent';

const selectedColor = '#2e9e0f';

export default class PlayLiveQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPercent: 0,
            isLoading: true,
            isScoreActive: false, // show is player correct
            isQuestionActive: false, 
            isResultRunning: false,  // leaderboard
            currentQuestionNumber: 0,
            totalQuestions: 'NA',
            isPlayerCorrect: false,
            playerScore: 'NA',
            roundBest: 'NA',
            playerTotalScore: 0,
            playerRank: 'NA',
            playerList: [],
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
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;
        this.socket = io();
        this.socket.on('broadcast', (data) => {
            if(data && data.action == 'question'){
                this.setState({
                    isQuestionActive: true,
                    isLoading: false,
                    isScoreActive: false,
                    isResultRunning: false,
                    isStatsActive: false,
                    questionObject: data.question,
                    totalQuestions: data.total_questions ? data.total_questions : this.state.totalQuestions,
                    currentTimeout: data.question.question_time,
                    currentQuestionNumber: parseInt(this.state.currentQuestionNumber) + 1
                }, () => {
                    this.startClock();
                })
            }
            else if(data && data.action == 'result'){
                
                if(data.users && data.users.length){
                    data.users.sort((a, b) => {
                        return b.total_score - a.total_score
                    });
                }
                
                let playerRank = 'NA';
                let playerObj = data.users ? data.users.find((val, index) => {
                    if(val.api_token == apiToken){
                        playerRank = index + 1;
                        return true;
                    }
                }) : {};
                
                let playerScore = playerObj.score ? playerObj.score : 0;
                let playerTotalScore = playerObj.total_score ? playerObj.total_score : 0;
                
                let userList = data.users.map(val => {
                    val.score = val.total_score
                    return val;
                });
                
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isScoreActive: true,
                    isResultRunning: false,
                    isStatsActive: false,
                    playerList: userList,
                    playerScore: playerScore,
                    playerRank: playerRank,
                    playerTotalScore: playerTotalScore
                });
            }
            else if(data && data.action == 'leaderBoard'){
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isScoreActive: false,
                    isResultRunning: true,
                    isStatsActive: false,
                    resultList: data.users
                });
            }
            else if(data && data.action == 'statsBoard'){
                let questionObject = this.state.questionObject;
                questionObject.options = questionObject.options.map((option, index) => {
                    let matchedOption = data.question.options.filter(responseOption => {
                        return responseOption.option_id == option.option_id
                    })[0];
                    return {
                        option_title: option.option_title,
                        option_id: option.option_id,
                        is_answer: matchedOption.is_answer,
                        optionCount: matchedOption[`option${parseInt(index) + 1}_count`]
                    }
                })
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isScoreActive: false,
                    isResultRunning: false,
                    isStatsActive: true,
                    questionObject: questionObject
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
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;
        
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
                    }, () => {
                        if(loadingPercent >= 100){
                            alert('You have successfully joined the game. Please wait for Game to start');
                        }
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
                    let apiToken = localStorage.apitk;
                    let sessionKey = localStorage.bqsid;
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
            return <ResultScreenComponent resultList={this.state.resultList} homeURL="/player-home"/>
        }
        else{
            return null;
        }
    }

    renderStatsScreen() {
        if(this.state.isStatsActive){
            return <StatsComponent 
                questionObj={this.state.questionObject}
                totalQuestions={this.state.totalQuestions}
                currentQuestionNumber={this.state.currentQuestionNumber}
                optionACount={this.state.questionObject.options[0].optionCount}
                optionBCount={this.state.questionObject.options[1].optionCount}
                optionCCount={this.state.questionObject.options[2].optionCount}
                optionDCount={this.state.questionObject.options[3].optionCount}
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
            {this.renderStatsScreen()}
            {this.renderResultScreen()}
        </div>
    }

}