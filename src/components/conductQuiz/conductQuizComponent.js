import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import QuestionComponent from './questionComponent';
import StatsComponent from '../common/statsComponent';
import LeaderBoardComponent from './leaderBoardComponent';
import ResultScreenComponent from '../common/resultScreenComponent';
import Loader from '../common/loader';

export default class ConductQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            isPlayerList: true,
            isLoading: false,
            isQuestionRunning: false,
            isStatsRunning: false,
            isLeaderBordRunning: false,
            isResultRunning: false,
            showLoader: false,
            loadingPercent: 0,
            currentQuestionRemainingTime: 5,
            currentQuestionNumber: 1,
            totalQuestions: 10,
            questionObject: {},
            leaderBoardList: [],
            resultList: []
        }
        this.onClickStartQuiz = this.onClickStartQuiz.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.onClickNextStats = this.onClickNextStats.bind(this);
        this.onClickNextLeaderBoard = this.onClickNextLeaderBoard.bind(this);
        if(typeof window !== 'undefined'){
            window.conductComponent = this;
        }
    }

    componentDidMount() {
        let apiToken = localStorage.apitk;

        if(apiToken){
            this.getPlayerList(apiToken);
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

    onClickNextLeaderBoard() {
        // put the request of next question or final stats for host
        
        let apiToken = localStorage.apitk;
        
        this.setState({
            showLoader: true
        });

        get(`/api/seminar/${this.props.quizPin}/next_question/`, {
            authorization: apiToken
        }).then(response => {
            if(response.message){
                alert(response.message);
            }
            if(response.status == 200 && response.quiz_ended){
                this.setState({
                    isPlayerList: false,
                    isLoading: false,
                    isQuestionRunning: false,
                    isStatsRunning: false,
                    isLeaderBordRunning: false,
                    isResultRunning: true,
                    showLoader: false,
                    resultList: response.users ? response.users : []
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

    onClickNextQuestion() {
        // put the request for stats for host
        let apiToken = localStorage.apitk;
        let data = {
            quiz_pin: this.props.quizPin,
            quiz_id: this.props.quizID,
            question_id: this.state.questionObject.question_id,
            option1_id: this.state.questionObject.options[0].option_id,
            option2_id: this.state.questionObject.options[1].option_id,
            option3_id: this.state.questionObject.options[2].option_id,
            option4_id: this.state.questionObject.options[3].option_id,
        };
        this.setState({
            showLoader: true
        });
        post(`/api/host/options/stats/`, data, {
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
                    optionCount: matchedOption[`option${parseInt(index) + 1}_count`]
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

    onClickNextStats() {
        // put the request of leaderboard stats data
        
        let apiToken = localStorage.apitk;
        let data = {
            quiz_pin: this.props.quizPin,
            quiz_id: this.props.quizID,
            question_id: this.state.questionObject.question_id
        };
        this.setState({
            showLoader: true
        });
        post(`/api/host/question/stats/`, data, {
            authorization: apiToken
        }).then(response => {
            if(response.message){
                alert(response.message);
            }
            if(response.users && response.users.length){
                response.users.sort((a, b) => {
                    return b.total_score - a.total_score
                });
                this.setState({
                    isLoading: false,
                    isPlayerList: false, 
                    isQuestionRunning: false,
                    isLeaderBordRunning: true,
                    isStatsRunning: false,
                    showLoader: false,
                    leaderBoardList: response.users.map((player, index) => {
                        return {
                            rank: parseInt(index) + 1,
                            name: player.name,
                            score: player.total_score,
                            isCorrect: player.is_answer
                        }
                    })
                });
            }
            else if(response.status == 400){
                this.setState({
                    isLoading: false,
                    isPlayerList: false, 
                    isQuestionRunning: false,
                    isLeaderBordRunning: true,
                    isStatsRunning: false,
                    showLoader: false,
                    leaderBoardList: []
                });
            }
            else{
                this.setState({
                    showLoader: false
                });
            }
        });

    }

    onClickStartQuiz() {
        let apiToken = localStorage.apitk;
        let message = '';
        this.setState({
            isLoading: true,
            loadingPercent: this.state.loadingPercent,
            isPlayerList: false,
            isQuestionRunning: false,
            isStatsRunning: false,
            isLeaderBordRunning: false
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
                        post(`/api/seminar/${this.props.quizPin}/start/`, null, {
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
                                    isStatsRunning: false,
                                    isLeaderBordRunning: false
                                });
                            }
                            else{
                                message = data.message;
                                alert(message ? message : 'error occured please try again');
                            }
                        }, error => {
                            console.log(error);
                            message = 'error occured check console';
                            alert(message);
                        });
                    }
                });
            }, 1000);
        });
    }

    getPlayerList(apiToken) {
        get(`/api/${this.props.quizPin}/users/`, {
            authorization: apiToken
        }).then(({users}) => {
            this.setState({
                playerList: (users && users.length) ? users : [] 
            }, () => {
                setTimeout(() => {
                    if(this.state.isPlayerList){
                        this.getPlayerList(apiToken);
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
                            <p style={{fontSize: '30px', margin: '0px'}} >PIN: {this.props.quizPin}</p>
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
                quizID: this.props.quizID,
                quizPin: this.props.quizPin
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
            />
        }
        else{
            return null;
        }
    }

    renderLeaderBoardScreen() {
        if(this.state.isLeaderBordRunning){
            return <LeaderBoardComponent 
                leaderBoardList={this.state.leaderBoardList} 
                onClickNext={this.onClickNextLeaderBoard}
            />
        }
        else{
            return null;
        }
    }

    renderResultScreen() {
        if(this.state.isResultRunning){
            return <ResultScreenComponent resultList={this.state.resultList} homeURL="/home" />
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
            {this.renderLeaderBoardScreen()}
            {this.renderResultScreen()}
            {this.renderLoader()}
        </div>
    }

}