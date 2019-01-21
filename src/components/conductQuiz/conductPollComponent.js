import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import QuestionComponent from './questionComponent';
import StatsComponent from '../common/statsComponent';
import ResultScreenComponent from '../common/resultScreenComponent';
import Loader from '../common/loader';
import PollResultComponent from '../common/pollResultComponent';

export default class ConductPollComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            isPlayerList: true,
            isLoading: false,
            isQuestionRunning: false,
            isStatsRunning: false,
            isResultRunning: false,
            showLoader: false,
            loadingPercent: 0,
            currentQuestionRemainingTime: 5,
            currentQuestionNumber: 1,
            totalQuestions: 10,
            questionObject: {},
            resultQuestions: []
        }
        this.onClickStartQuiz = this.onClickStartQuiz.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.onClickNextStats = this.onClickNextStats.bind(this);
        if(typeof window !== 'undefined'){
            window.conductComponent = this;
        }
    }

    componentDidMount() {
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;

        if(apiToken && sessionKey){
            this.getPlayerList(apiToken, sessionKey);
        }
        else{
            location.href = '/login';
        }
    }

    componentDidUpdate() {
        if(this.state.isQuestionRunning && this.state.currentQuestionRemainingTime){
            this.timeout = setTimeout(() => {
                let remainingTime = this.state.currentQuestionRemainingTime - 1;
                if(remainingTime <= 0){
                    remainingTime = 0;
                    clearTimeout(this.timeout);
                }
                this.setState({
                    currentQuestionRemainingTime: remainingTime
                });
            }, 1000);
        }
    }

    onClickNextQuestion() {
        // put the request for stats for host
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;
        let data = {
            poll_pin: this.props.pollPin,
            poll_id: this.props.pollID,
            question_id: this.state.questionObject.question_id,
            option1_id: this.state.questionObject.options[0].option_id,
            option2_id: this.state.questionObject.options[1].option_id,
            option3_id: this.state.questionObject.options[2].option_id,
            option4_id: this.state.questionObject.options[3].option_id,
        };
        this.setState({
            showLoader: true
        });
        post(`/api/poll/host/options/stats/`, data, {
            authorization: apiToken
        }).then(data => {
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
                isLoading: false,
                isPlayerList: false, 
                isQuestionRunning: false,
                isStatsRunning: true,
                showLoader: false,
                questionObject
            })
        })
    }

    onClickStartQuiz() {
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;
        let message = '';
        this.setState({
            isLoading: true,
            loadingPercent: this.state.loadingPercent,
            isPlayerList: false,
            isQuestionRunning: false,
            isStatsRunning: false
        }, () => {
            this.interval = setInterval(() => {
                let loadingPercent = parseInt(this.state.loadingPercent) + parseInt(50*Math.random());
                if(loadingPercent >= 100){
                    clearInterval(this.interval);
                    loadingPercent = 100;
                }
                this.setState({
                    loadingPercent: loadingPercent
                }, () => {
                    if(loadingPercent >= 100){
                        post(`/api/poll/seminar/${this.props.pollPin}/start/`, null, {
                            authorization: apiToken
                        }).then(data => {
                            if(data.question && data.question.question_time){
                                this.setState({
                                    questionObject: data.question,
                                    totalQuestions: data.total_questions,
                                    currentQuestionNumber: 1,
                                    currentQuestionRemainingTime: parseInt(data.question.question_time),
                                    isLoading: false,
                                    isPlayerList: false,
                                    isQuestionRunning: true,
                                    isStatsRunning: false
                                });
                            }
                            else{
                                message = data.message;
                            }
                        }, error => {
                            console.log(error);
                            message = 'error occured check console';
                        });
                    }
                });
            }, 1000);
        });
    }

    getPlayerList(apiToken, sessionKey) {
        get(`/api/poll/${this.props.pollPin}/users/`, {
            authorization: apiToken
        }).then(({users}) => {
            this.setState({
                playerList: (users && users.length) ? users : [] 
            }, () => {
                setTimeout(() => {
                    if(this.state.isPlayerList){
                        this.getPlayerList(apiToken, sessionKey);
                    }
                }, 3000);
            });
        })        
    }

    renderBody() {
        if(this.state.isPlayerList){
            return <section id="titlebar">
                <div className="container">
                    <div className="row titlerow">
                        <div className="col-xs-3 col-md-2" >
                            <img src="/images/br.png" className="img-responsive logo" />
                        </div>
                        <div className="col-xs-9 col-md-8 text-center" >
                            <p style={{fontSize: '30px', margin: '0px'}} >PIN: {this.props.pollPin}</p>
                        </div>
                        <div className="col-xs-2 hidden-sm hidden-xs " >
                            
                        </div>
                    </div>
                    <div className="row smartimage toprow">
                        <div className="col-xs-12 col-md-12" >
                            <button type="button" className="btn btn-success pull-right" onClick={this.onClickStartQuiz}>Start</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12" >
                        </div>  
                    </div>
                    {this.renderPlayerList()}
                </div>
            </section>
        }
        else{
            return null;
        }
    }

    renderPlayerList() {
        if(this.state.playerList && this.state.playerList.length){
            return <React.Fragment>
                <div className="row text-left" key="1">
                    <div className="col-xs-12" >
                        <p style={{fontSize: '30px', margin: '0px', color: '#4a4a4a'}}>Players: {this.state.playerList.length}</p>
                    </div>
                </div>
                <div className="row tablerow tablecont" style={{padding:'10px'}} key="2">
                    <div className="col-md-1 hidden-sm hidden-xs" >
                        
                    </div>
                    <div className="col-xs-10 col-md-8 " >
                        <div className="table-wrapper-scroll-y tablescroll player-table" style={{maxHeight: '180px', color:'#4d4d4d'}}>
                            {this.state.playerList.map(player => {
                                return <div className="table-element">{player.player_name}</div>
                            })}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        }
        else{
            return <div className="row text-left" key="1">
                <div className="col-xs-12" >
                    <p style={{fontSize: '30px', margin: '0px', color: '#4a4a4a'}}>No Players Yet.</p>
                </div>
            </div>
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

    renderRunningQuestion() {
        if(this.state.isQuestionRunning){
            return <QuestionComponent 
                currentQuestionNumber={this.state.currentQuestionNumber} 
                remainingTime={this.state.currentQuestionRemainingTime} 
                onClickNext={this.onClickNextQuestion} 
                questionObject={this.state.questionObject} 
                totalQuestions={this.state.totalQuestions}
            />
        }
        else{
            return null;
        }
    }
    
    renderStatsScreen() {
        if(this.state.isStatsRunning){
            return <StatsComponent 
                questionObj={this.state.questionObject}
                totalQuestions={this.state.totalQuestions}
                onClickNext={this.onClickNextStats}
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

    onClickNextStats() {
        
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;
        
        this.setState({
            showLoader: true
        });

        get(`/api/poll/seminar/${this.props.pollPin}/next_question/`, {
            authorization: apiToken
        }).then(response => {
            if(response.message){
                alert(response.message);
            }
            if(response.status == 200 && response.poll_ended){
                this.setState({
                    isPlayerList: false,
                    isLoading: false,
                    isQuestionRunning: false,
                    isStatsRunning: false,
                    isLeaderBordRunning: false,
                    isResultRunning: true,
                    showLoader: false,
                    pollName: response.poll_name,
                    resultQuestions: response.questions ? response.questions : []
                });
            }
            else if(response.status == 200 && response.question){
                this.setState({
                    isLoading: false,
                    isPlayerList: false, 
                    isQuestionRunning: true,
                    isStatsRunning: false,
                    isLeaderBordRunning: false,
                    showLoader: false,
                    questionObject: response.question,
                    currentQuestionRemainingTime: response.question.question_time,
                    currentQuestionNumber: parseInt(this.state.currentQuestionNumber) + 1
                })
            }
            else{
                alert('something went wrong');
                this.setState({
                    showLoader: false
                })
            }
        });
    }

    renderResultScreen() {
        if(this.state.isResultRunning){
            return <PollResultComponent resultQuestions={this.state.resultQuestions} homeURL="/home" pollName={this.state.pollName} />
        }
        else{
            return null;
        }
    }

    renderLoader() {
        return <Loader isLoading={this.state.showLoader} />
    }

    render() {
        return <div className="conduct">
            {this.renderHiddenData()}
            {this.renderBody()}
            {this.renderLoadingScreen()}
            {this.renderRunningQuestion()}
            {this.renderStatsScreen()}
            {this.renderResultScreen()}
            {this.renderLoader()}
        </div>
    }

}