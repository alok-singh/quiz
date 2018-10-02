import React, { Component } from 'react';
import {get, post} from '../../common/api';
import Modal from '../common/modal';

const selectedColor = '#2e9e0f';

export default class PlayQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            currentQuestion: 1,
            currentTimeout: 30,
            isAnsweringAllowed: true,
            isModalVisible: false,
            isCurrentQuestionAnswered: false,
            modalData: ''
        }
        this.onClickNext = this.onClickNext.bind(this);
    }

    onClickNext() {
        if(!this.state.isAnsweringAllowed || this.state.isCurrentQuestionAnswered){
            if(this.state.currentQuestion < this.state.questionList.length){
                this.setState({
                    currentQuestion: this.state.currentQuestion + 1,
                    currentTimeout: this.state.questionList[this.state.currentQuestion].question_time ? this.state.questionList[this.state.currentQuestion].question_time : 30,
                    isAnsweringAllowed: true,
                    isCurrentQuestionAnswered: false
                }, () => {
                    clearInterval(this.interval);
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
            }
            else{
                let apiToken = sessionStorage.apitk;
                let sessionKey = sessionStorage.bqsid;
                post('/api/quiz/answers/', this.getMappedData(), {
                    authorization: apiToken
                }).then(data => {
                    clearInterval(this.interval);
                    this.setState({
                        isModalVisible: true,
                        modalData: data
                    })
                })
            }
        }
    }

    onClickAnswer(optionIndex, questionIndex) {
        if(this.state.isAnsweringAllowed){
            let {questionList} = this.state;
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
                isCurrentQuestionAnswered: true
            });
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
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        get(`/api/quiz/${this.props.quizID}/play/`, {
            authorization: apiToken
        }).then(data => {
            this.setState({
                questionList: data.questions ? data.questions : [],
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

    renderQuestion() {
        let questionIndex = this.state.currentQuestion-1;
        let questionObject = this.state.questionList[questionIndex];
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
                        </div>  
                        <div className="col-xs-2 col-md-2" >
                            
                        </div>
                    </div>
                    <div className="row quesbtn">
                        {questionObject.options.map((option, index) => {
                            return <div className="col-xs-6" >
                                <button onClick={() => this.onClickAnswer(index, questionIndex)} type="button" className="btn btn-success btn-block" style={{background: option.is_answer ? selectedColor : '#b9b9b9'}}>{option.option_title}</button>
                            </div>
                        })}
                    </div>
                </div>
            </section>
        }
        else{
            return <div style={{fontSize: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>No Questions Added in Quiz</div>
        }
    }

    renderNextButton() {
        if((!this.state.isAnsweringAllowed || this.state.isCurrentQuestionAnswered) && this.state.questionList.length){
            return <div style={{textAlign: 'center', margin: '30px 0px'}}>
                <button onClick={this.onClickNext} className="btn btn-success" style={{height: '42px', width: '120px', fontSize: '16px', textTransform: 'capitalize', display: 'inline-block', background: '#0067d5', border: '1px solid #0067d5'}}>{this.state.currentQuestion < this.state.questionList.length ? 'next' : 'finish'}</button>
            </div>
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
                    </div>
                    <a className="btn-signin" onClick={() => location.reload()}>Retry Quiz</a>
                    <a className="btn-signin" href='/player-home' style={{marginLeft: '5px'}}>Home</a>
                </div>
            </Modal>
        }
    }

    render() {
        return <div className="main">
            {this.renderQuestion()}
            {this.renderHiddenData()}
            {this.renderNextButton()}
            {this.renderModal()}
        </div>
    }

}