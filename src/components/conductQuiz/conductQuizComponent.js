import React, { Component } from 'react';
import {get, post} from '../../common/api';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import QuestionComponent from './questionComponent';
import StatsComponent from './statsComponent';
import LeaderBoardComponent from './leaderBoardComponent';

export default class AddQuestionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerList: [],
            isPlayerList: true,
            isLoading: false,
            isQuestionRunning: false,
            isStatsRunning: false,
            isLeaderBordRunning: false,
            loadingPercent: 0,
            currentQuestionRemainingTime: 5,
            currentQuestionNumber: 1,
            totalQuestions: 10,
            optionACount: 1,
            optionBCount: 1,
            optionCCount: 1,
            optionDCount: 1,
            questionObject: {
                "options": [
                {
                    "option_title": "National Aeronautical Space Agency",
                    "option_id": 49,
                    is_answer: true
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
            leaderBoardList: []
        }
        this.onClickStartQuiz = this.onClickStartQuiz.bind(this);
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.onClickNextStats = this.onClickNextStats.bind(this);
        this.onClickNextLeaderBoard = this.onClickNextLeaderBoard.bind(this);
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        this.getPlayerList(apiToken, sessionKey);
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
        this.setState({
            isLoading: false,
            isPlayerList: false, 
            isQuestionRunning: true,
            isStatsRunning: false,
            isLeaderBordRunning: false,
            optionACount: 12,
            optionBCount: 5,
            optionCCount: 8,
            optionDCount: 2
        })
    }

    onClickNextQuestion() {
        // put the request for stats for host
        this.setState({
            isLoading: false,
            isPlayerList: false, 
            isQuestionRunning: false,
            isStatsRunning: true,
            optionACount: 12,
            optionBCount: 5,
            optionCCount: 8,
            optionDCount: 2
        })
    }

    onClickNextStats() {
        // put the request of leaderboard stats data
        this.setState({
            isLoading: false,
            isPlayerList: false, 
            isQuestionRunning: false,
            isLeaderBordRunning: true,
            isStatsRunning: false,
            leaderBoardList: [{
                rank: 1,
                name: 'Rahul',
                score: 1903,
                isCorrect: true
            }, {
                rank: 2,
                name: 'Additti',
                score: 1803,
                isCorrect: true,
            }, {
                rank: 3,
                name: 'Kamya',
                score: 1203,
                isCorrect: false,
            }]
        })
    }

    onClickStartQuiz() {
        this.setState({
            isLoading: true,
            loadingPercent: this.state.loadingPercent,
            isPlayerList: false
        }, () => {
            this.timeout = setInterval(() => {
                let loadingPercent = parseInt(this.state.loadingPercent) + parseInt(50*Math.random());
                if(loadingPercent >= 100){
                    clearInterval(this.timeout);
                    loadingPercent = 100;
                }
                this.setState({
                    loadingPercent: loadingPercent
                }, () => {
                    if(loadingPercent >= 100){
                        this.setState({
                            isLoading: false,
                            isPlayerList: false,
                            isQuestionRunning: true
                        })
                    }
                });
            }, 1000);
        });
    }

    getPlayerList(apiToken, sessionKey) {
        get(`/api/${this.props.quizPin}/users/`, {
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
                            <img src="/images/smart.png" className="img-responsive" style={{margin: '0 auto', height: '160px'}} />
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
                optionACount={this.state.optionACount}
                optionBCount={this.state.optionBCount}
                optionCCount={this.state.optionCCount}
                optionDCount={this.state.optionDCount}
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

    render() {
        return <div className="conduct">
            {this.renderHiddenData()}
            {this.renderBody()}
            {this.renderLoadingScreen()}
            {this.renderRunningQuestion()}
            {this.renderStatsScreen()}
            {this.renderLeaderBoardScreen()}
        </div>
    }

}