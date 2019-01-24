import React, { Component } from 'react';
import {get, post} from '../../common/api';
import ScoreBoardComponent from './scoreBoardComponent';
import Modal from '../common/modal';
import LoadingScreenComponent from '../common/loadingScreenComponent';
import StatsComponent from '../common/statsComponent';

const optionColorList = [
    'rgba(226, 27, 60, 0.6)',
    'rgba(19, 104, 206, 0.6)',
    'rgba(216, 158, 0, 0.6)',
    'rgba(41, 143, 13, 0.6)'
];

const selectedColorList = [
    'rgb(226, 27, 60)',
    'rgb(19, 104, 206)',
    'rgb(216, 158, 0)',
    'rgb(41, 143, 13)'
];

export default class PlayQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            currentQuestion: 1,
            currentTimeout: 30,
            isAnsweringAllowed: true,
            isModalVisible: false,
            isLoading: true,
            loadingPercent: 0,
            isCurrentQuestionAnswered: false,
            modalData: '',
            playerScore: 'NA',
            isPlayerCorrect: undefined,
            isScoreActive: false,
            isStatsActive: false,
            isQuestionActive: false,
            answeredAtTimeRemaining: 0,
            playerTotalScore: 0,
            correctAnswerID: null
        }
        this.onClickNextQuestion = this.onClickNextQuestion.bind(this);
        this.onClickNextScoreBoard = this.onClickNextScoreBoard.bind(this);
        this.onClickNextStats = this.onClickNextStats.bind(this);
    }

    onClickNextQuestion() {
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;
        let currentQuestionObject = this.state.questionList[this.state.currentQuestion-1];
        let markedOption = currentQuestionObject.options.find(val => val.is_answer);
        let optionID = markedOption ? markedOption.option_id : 0;
        post('/api/quiz/question/answer/', {
            quiz_id: this.props.quizID,
            question_id: currentQuestionObject.question_id,
            time_remaining: this.state.answeredAtTimeRemaining*1000,
            question_time: currentQuestionObject.question_time,
            option_id: optionID
        }, {
            authorization: apiToken
        }).then(response => {
            this.setState({
                isQuestionActive: false,
                isScoreActive: false,
                isStatsActive: true,
                isPlayerCorrect: optionID == 0 ? undefined : response.is_answer,
                playerScore: Math.round(response.score),
                playerTotalScore: parseInt(this.state.playerTotalScore) + Math.round(response.score),
                correctAnswerID: response.correct_answer_id
            }, () => {
                clearInterval(this.interval);
            });
        })
    }

    onClickAnswer(optionIndex, questionIndex) {
        if(this.state.isAnsweringAllowed){
            let {questionList} = this.state;
            let answeredAtTimeRemaining = this.state.currentTimeout;
            let options = questionList[questionIndex].options.map(val => {
                return {
                    option_title: val.option_title,
                    option_id: val.option_id
                }
            });
            options[optionIndex].is_answer = true;
            questionList[questionIndex].options = options;
            this.setState({
                questionList,
                isCurrentQuestionAnswered: true,
                answeredAtTimeRemaining: answeredAtTimeRemaining
            }, () => {
                this.onClickNextQuestion();
            });
        }
    }

    onClickNextStats() {
        this.setState({
            isScoreActive: true,
            isStatsActive: false
        });
    }

    onClickNextScoreBoard() {
        if(!this.state.isAnsweringAllowed || this.state.isCurrentQuestionAnswered){
            if(this.state.currentQuestion < this.state.questionList.length){
                this.setState({
                    currentQuestion: this.state.currentQuestion + 1,
                    currentTimeout: this.state.questionList[this.state.currentQuestion].question_time ? this.state.questionList[this.state.currentQuestion].question_time : 30,
                    isAnsweringAllowed: true,
                    isCurrentQuestionAnswered: false,
                    isQuestionActive: true,
                    isScoreActive: false
                }, () => {
                    clearInterval(this.interval);
                    this.interval = setInterval(() => {
                        if(this.state.currentTimeout - 1 >= 0){
                            this.setState({
                                currentTimeout: this.state.currentTimeout - 1,
                                isAnsweringAllowed: true,
                                isQuestionActive: true,
                                isScoreActive: false
                            });
                        }
                        else{
                            clearInterval(this.interval);
                            this.setState({
                                isAnsweringAllowed: false,
                                isQuestionActive: true,
                                isScoreActive: false
                            }, () => {
                                this.onClickNextQuestion();
                            })
                        }
                    }, 1000)
                });
            }
            else{
                let apiToken = localStorage.apitk;
                let sessionKey = localStorage.bqsid;
                post('/api/quiz/answers/', this.getMappedData(), {
                    authorization: apiToken
                }).then(data => {
                    clearInterval(this.interval);
                    this.setState({
                        isModalVisible: true,
                        modalData: data,
                        isQuestionActive: true,
                        isScoreActive: false
                    })
                })
            }
        }
    }

    getMappedData() {
        let questions = this.state.questionList.map(question => {
            let retObj = {};
            let markedOption = question.options.filter(val => {
                return val.is_answer;
            })[0];
            retObj.option_id = markedOption ? markedOption.option_id : null
            retObj.question_id = question.question_id;
            return retObj
        });

        return {
            quiz_id: this.props.quizID,
            questions 
        }
    }

    componentDidMount() {
        let apiToken = localStorage.apitk;
        let sessionKey = localStorage.bqsid;

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
                        get(`/api/quiz/${this.props.quizID}/play/`, {
                            authorization: apiToken
                        }).then(data => {
                            this.setState({
                                isQuestionActive: true,
                                isLoading: false,
                                questionList: data.questions ? data.questions : [],
                                isRequestCompleted: true,
                                currentTimeout: data.questions && data.questions.length ? data.questions[0].question_time : 30,
                            }, () => {
                                this.interval = setInterval(() => {
                                    if(this.state.currentTimeout - 1 >= 0){
                                        this.setState({
                                            currentTimeout: this.state.currentTimeout - 1,
                                            isAnsweringAllowed: true
                                        });
                                    }
                                    else{
                                        clearInterval(this.interval);
                                        this.setState({
                                            isAnsweringAllowed: false
                                        })
                                    }
                                }, 1000)
                            });
                        })
                    }
                });
            }
        }, 1000);
    }

    renderQuestion() {
        let questionIndex = this.state.currentQuestion-1;
        let questionObject = this.state.questionList[questionIndex];
        if(this.state.isQuestionActive){
            if(questionObject){
                return <section id="titlebar">
                    <div className="container">
                        <div className="row titlerow">
                            <div className="col-xs-3 col-md-2" >
                                <img src="/images/br.png" className="img-responsive logo" />
                            </div>
                            <div className="col-xs-9 col-md-8 text-center" >
                                <p style={{fontFamily: 'Hobo Std', fontSize: '30px', color: '#000000', margin: '0px'}}>Question {this.state.currentQuestion} of {this.state.questionList.length}</p>
                            </div>
                            <div className="col-xs-2 hidden-sm hidden-xs " >
                                
                            </div>
                        </div>
                        <div className="row smartimage">
                            <div className="col-xs-12 gap" style={{textAlign: 'right'}}>
                                <div style={{display: 'inline-block', height: '90px', width: '90px', textAlign: 'center', borderRadius: '50%', background: '#008ff8', marginTop: '10px', padding: '11px', color: '#fff'}}>
                                    <span style={{fontSize: '30px', display: 'block'}}>{this.state.currentTimeout}</span>
                                    <span>Seconds</span>
                                </div>
                            </div>
                        </div>
                        <div className="row headrow">
                            <div className="col-xs-2 col-md-2" >
                                
                            </div>
                            <div className="col-xs-12 col-md-8 text-center" >
                                <p style={{fontFamily: 'Hobo Std', fontSize: '46px', color: '#000000', margin: '0px'}}>{questionObject.question_title}</p>
                                {questionObject.question_image ? <img src={questionObject.question_image} style={{marginTop: '30px', marginBottom: '-100px', height: '182px'}} /> : null}
                            </div>  
                            <div className="col-xs-2 col-md-2" >
                                
                            </div>
                        </div>
                        <div className="row quesbtn">
                            {questionObject.options.map((option, index) => {
                                return <div className="col-xs-6" >
                                    <button onClick={() => this.onClickAnswer(index, questionIndex)} type="button" className="btn btn-success btn-block" style={{background: option.is_answer ? selectedColorList[index] : optionColorList[index]}}>{option.option_title}</button>
                                </div>
                            })}
                        </div>
                    </div>
                </section>

            }
            else {
                return <div style={{fontSize: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>No Questions Added in Quiz</div>
            }
        }
        else{
            return null;
        }
    }

    renderHiddenData() {
        if(typeof window == 'undefined'){
            return <span id='data' style={{display: 'none'}}>{this.props.quizID}</span>
        }
        else{
            return null;
        }
    }

    renderScoreBoard() {
        if(this.state.isScoreActive){
            return <ScoreBoardComponent 
                currentQuestionNumber={this.state.currentQuestion}
                totalQuestions={this.state.questionList.length}
                isPlayerCorrect={this.state.isPlayerCorrect}
                playerScore={this.state.playerScore}
                showNextButton={true}
                playerTotalScore={this.state.playerTotalScore}
                onClickNextScoreBoard={this.onClickNextScoreBoard}
                playerRank={1}
            />
        }
        else{
            return null;
        }
    }

    renderStatsScreen() {
        if(this.state.isStatsActive){
            let questionObject = this.state.questionList[this.state.currentQuestion-1];
            questionObject.options = questionObject.options.map(option => {
                delete option.is_answer;
                if(option.option_id == this.state.correctAnswerID){
                    option.is_answer = true;
                }
                return option;
            })
            return <StatsComponent 
                questionObj={questionObject}
                totalQuestions={this.state.questionList.length}
                currentQuestionNumber={this.state.currentQuestion}
                onClickNext={this.onClickNextStats}
                hideGraph={true}
            />
        }
        else{
            return null;
        }
    }

    renderModal() {
        if(this.state.modalData && this.state.isModalVisible){
            let {modalData} = this.state;
            return <Modal isVisible={this.state.isModalVisible} width="40%">
                <div className="content-wrapper">
                    <h2>Results</h2>
                    <div className="table-wrapper">
                        <div className="result-row">
                            <div className="parameter">Total Attemted Questions</div>
                            <div className="value">{modalData.total_attemted_questions}</div>
                        </div>
                        <div className="result-row">
                            <div className="parameter">Total Number of Questions</div>
                            <div className="value">{modalData.total_questions}</div>
                        </div>
                        <div className="result-row">
                            <div className="parameter">Total Number of Correct Answers</div>
                            <div className="value">{modalData.correct_answers}</div>
                        </div>
                        <div className="result-row">
                            <div className="parameter">Total Number of Incorrect Answers</div>
                            <div className="value">{modalData.wrong_answers}</div>
                        </div>
                        <div className="result-row">
                            <div className="parameter">Total Score</div>
                            <div className="value">{modalData.total_score}</div>
                        </div>
                    </div>
                    <a className="btn-signin" href='/player-home' style={{marginLeft: '5px'}}>Home</a>
                </div>
            </Modal>
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

    render() {
        return <div className="main">
            {this.renderLoadingScreen()}
            {this.renderQuestion()}
            {this.renderHiddenData()}
            {this.renderScoreBoard()}
            {this.renderStatsScreen()}
            {this.renderModal()}
        </div>
    }

}