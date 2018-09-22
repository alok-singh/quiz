import React, { Component } from 'react';
import {get, post} from '../../common/api';

const selectedColor = '#2e9e0f';

export default class PlayQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            currentQuestion: 1,
            currentTimeout: 30,
            isAnsweringAllowed: true
        }
        this.onClickNext = this.onClickNext.bind(this);
    }

    onClickNext() {
        if(!this.state.isAnsweringAllowed){
            if(this.state.currentQuestion < this.state.questionList.length){
                this.setState({
                    currentQuestion: this.state.currentQuestion + 1,
                    currentTimeout: this.state.questionList[this.state.currentQuestion].question_time ? this.state.questionList[this.state.currentQuestion].question_time : 30,
                    isAnsweringAllowed: true
                }, () => {
                    let interval = setInterval(() => {
                        if(this.state.currentTimeout - 1 >= 0){
                            this.setState({
                                currentTimeout: this.state.currentTimeout - 1,
                                isAnsweringAllowed: true
                            });
                        }
                        else{
                            clearInterval(interval);
                            this.setState({
                                isAnsweringAllowed: false
                            })
                        }
                    }, 1000)
                });
            }
            else{
                console.log(this.state);
            }
        }
    }

    onClickAnswer(optionIndex, questionIndex) {
        if(this.state.isAnsweringAllowed){
            let {questionList} = this.state;
            let options = questionList[questionIndex].options.map(val => {
                return {
                    option_title: val.option_title
                }
            });
            options[optionIndex].is_answer = true;
            questionList[questionIndex].options = options;
            this.setState({
                questionList
            });
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
                let interval = setInterval(() => {
                    if(this.state.currentTimeout - 1 >= 0){
                        this.setState({
                            currentTimeout: this.state.currentTimeout - 1,
                            isAnsweringAllowed: true
                        });
                    }
                    else{
                        clearInterval(interval);
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
                        <div class="col-xs-12 gap" style={{textAlign: 'right'}}>
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
            return <span>Wait</span>
        }
    }

    renderNextButton() {
        if(!this.state.isAnsweringAllowed){
            return <div style={{textAlign: 'center', margin: '30px 0px'}}>
                <button onClick={this.onClickNext} class="btn btn-success" style={{height: '42px', width: '120px', fontSize: '16px', textTransform: 'capitalize', display: 'inline-block', background: '#0067d5', border: '1px solid #0067d5'}}>{this.state.currentQuestion < this.state.questionList.length ? 'next' : 'finish'}</button>
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

    render() {
        return <div className="main">
            {this.renderQuestion()}
            {this.renderHiddenData()}
            {this.renderNextButton()}
        </div>
    }

}