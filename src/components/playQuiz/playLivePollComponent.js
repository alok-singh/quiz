import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import QuestionComponent from './questionComponent';
import StatsComponent from '../common/statsComponent';
import PollResultComponent from '../common/pollResultComponent';

const selectedColor = '#2e9e0f';

export default class PlayLivePollComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPercent: 0,
            isLoading: true,
            isQuestionActive: false, 
            isResultRunning: false,  // leaderboard
            currentQuestionNumber: 0,
            totalQuestions: 'NA',
            isPlayerCorrect: false,
            playerScore: 'NA',
            roundBest: 'NA',
            playerTotalScore: 'NA',
            playerRank: 'NA',
            playerList: [],
            isAnsweringAllowed: true,
            questionObject: {},
            currentTimeout: 10,
            resultQuestions: []
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
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isResultRunning: false,
                    isStatsActive: false,
                    playerList: data.users
                });
            }
            else if(data && data.action == 'leaderBoard'){
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
                    isResultRunning: true,
                    isStatsActive: false,
                    resultQuestions: data.questions ? data.questions : [],
                    pollName: data.poll_name
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
                        optionCount: matchedOption[`option_count`]
                    }
                })
                this.setState({
                    isQuestionActive: false,
                    isLoading: false,
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
        
        if(apiToken){
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
                    let answeredOption = this.state.questionObject.options.filter(option => {
                        return option.is_answer
                    })[0];
                    let data = {
                        poll_id: this.props.pollID,
                        question_id: this.state.questionObject.question_id,
                        poll_pin: this.props.pollPin,
                        option_id: answeredOption ? answeredOption.option_id : null
                    };
                    post(`/api/poll/player/answer/`, data, {
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
                pollID: this.props.pollID,
                pollPin: this.props.pollPin
            })
            return <span id='data' style={{display: 'none'}}>{data}</span>
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
            return <PollResultComponent resultQuestions={this.state.resultQuestions} homeURL="/player-home" pollName={this.state.pollName} />
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
                isPoll={true}
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
            {this.renderQuestion()}
            {this.renderStatsScreen()}
            {this.renderResultScreen()}
        </div>
    }

}