import React, { Component } from 'react';
import {get, post} from '../../common/api';

const defaultQuestion = [{
    question_title: "Please add question here",
    image_url: "",
    question_time: 30,
    options: [{
        option_title: "choice1",
        is_answer: true
    },
    {
        option_title: "choice2"
    },
    {
        option_title: "choice3"
    },
    {
        option_title: "choice4"
    }]
}];

export default class AddQuestionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: defaultQuestion
        }
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onClickAddQuestion = this.onClickAddQuestion.bind(this);
        this.onClickSaveQuiz = this.onClickSaveQuiz.bind(this);
    }

    onClickSaveQuiz() {
        let data = this.getMappedData();
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        
        if(this.props.pollID){
            post('/api/poll/question/add/', data, {
                authorization: apiToken
            }).then(response => {
                alert(response.message);
            })
        }
        else{
            post('/api/question/add/', data, {
                authorization: apiToken
            }).then(response => {
                alert(response.message);
            })
        }
    }

    getMappedData() {
        let mappedData = {};
        let isAnswer = '';

        mappedData.quiz_id = this.props.quizID;
        mappedData.poll_id = this.props.pollID;
        mappedData.questions = this.state.questions.map(question => {
            question.options.forEach((val, index) => {
                if(val.is_answer){
                    isAnswer = `option${index+1}`
                }
            });
            return {
                question_text: question.question_title,
                question_time: question.question_time,
                image_url: "",
                question_image: "",
                option1: question.options[0].option_title,
                option2: question.options[1].option_title,
                option3: question.options[2].option_title,
                option4: question.options[3].option_title,
                is_answer: isAnswer
            }
        });

        return mappedData;
    }

    onClickAddQuestion() {
        let {questions} = this.state;
        questions.push({
            question_title: "Please add question here",
            image_url: "",
            question_time: 30,
            options: [{
                option_title: "choice1"
            },
            {
                option_title: "choice2"
            },
            {
                option_title: "choice3"
            },
            {
                option_title: "choice4"
            }]
        });
        this.setState({
            questions
        });
    }

    onClickRemoveQuestion(index) {
        let {questions} = this.state;
        questions = questions.slice(0, index).concat(questions.slice(index+1));
        this.setState({
            questions
        });
    }

    onClickCorrectAnswer(index, optionIndex) {
        let {questions} = this.state;
        let options = questions[index].options.map(val => {
            return {
                option_title: val.option_title
            }
        });
        options[optionIndex].is_answer = true;
        questions[index].options = options;
        this.setState({
            questions
        });
    }

    onChangeInput(value, key, index, optionIndex) {
        let {questions} = this.state;
        
        if(questions[index]){
            if(questions[index][key] && Array.isArray(questions[index][key])){
                questions[index][key][optionIndex].option_title = value;
            }
            else{
                questions[index][key] = value;
            }
        }

        this.setState({
            questions
        });
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;

        if(apiToken && sessionKey){
            get(`${this.props.quizID ? ('/api/quiz/' + this.props.quizID) : ('/api/poll/' + this.props.pollID)}/questions/`, {
                authorization: apiToken
            }).then(data => {
                this.setState({
                    questions: data.questions ? data.questions : defaultQuestion
                });
            });
        }
        else{
            location.href = '/login';
        }
    }

    renderOption(option, optionIndex, index) {
        if(this.props.pollID){
            return null;
        }
        else if(option.is_answer){
            return <p><span><i className="fa fa-check-circle" ></i></span></p>
        }
        else{
            return <p><span onClick={() => this.onClickCorrectAnswer(index, optionIndex)}><i className="fa fa-circle" ></i></span></p>
        } 
    }

    renderTopComponent() {
        return <section id="toptitle">
            <div className="row titlerow">
                <div className="col-xs-12 text-center x" >
                    <p style={{fontFamily: 'Calibri', fontWeight: 'bold', lineHeight: '1', fontSize: '30px', color: '#ffffff', margin: '0px'}} >Questions</p>
                </div>
            </div>
        </section>
    }

    renderQuestionList() {
        if(this.state.questions.length){
            return this.state.questions.map((question, index) => {
                return <section className="topcontent" >
                    <div className="container">
                        <div className="row titlerow" style={{padding: '25px 0px 0px'}}>
                            <div className="col-xs-12 col-md-8 " >
                                <div className="row">
                                    <div className="col-xs-12" >
                                        <p style={{fontSize: '20px', color: '#676767', fontWeight : 'bold', lineHeight: '34px', marginBottom: '15px'}} >Question {index + 1}</p>
                                        <textarea rows="4" style={{fontSize: '22px', padding: '15px'}} value={question.question_title} onChange={({target}) => this.onChangeInput(target.value, 'question_title', index)}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="uploadsection col-xs-12 col-md-4 " >
                                <div className="row">
                                    <div className="col-xs-12 " >
                                        <p style={{fontSize: '20px', color: '#676767', fontWeight: 'bold', lineHeight: '34px', marginBottom: '15px'}} >Add Photo</p>
                                        <div className="innerboxx text-center" style={{padding: '61px 20px 5px'}}>
                                            <hr />
                                            <p>
                                                <span>
                                                    <button type="button" className="btn btn-success" style={{background: '#31a2ff'}} >Upload</button>
                                                </span>
                                                <span>
                                                    <button type="button" className="btn btn-success" style={{background: '#b650cf'}} >Change</button>
                                                </span>
                                                <span><button type="button" className="btn btn-success" style={{background: '#ff8f45'}} >Remove</button>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col-xs-12">
                                <p style={{fontSize: '20px', marginTop: '15px'}}>
                                    <span>Question Time(s)</span>
                                    <span>
                                        <input className="btn" style={{fontSize: '18px', background: '#ffffff', border: '1px solid #474747', borderRadius: '0px', fontWeight: 'bold', marginLeft: '15px'}} value={question.question_time ? question.question_time : 30} onChange={({target}) => this.onChangeInput(target.value, 'question_time', index)}></input>
                                    </span>
                                    <button type="button" className="btn btn-success" style={{background: '#31a2ff', marginLeft: '30px', lineHeight: '26px'}} onClick={() => this.onClickRemoveQuestion(index)}>Remove This Question</button>
                                </p>
                            </div>
                        </div>
                        
                        <div className="questionbox row">
                            {question.options.map((option, optionIndex) => {
                                return <div className="col-xs-12 col-md-6">
                                    <p style={{fontSize: '18px'}}>Answer {optionIndex + 1}</p>
                                    <input className="btn" value={option.option_title} onChange={({target}) => this.onChangeInput(target.value, 'options', index, optionIndex)}></input>
                                    {this.renderOption(option, optionIndex, index)}
                                </div>
                            })}
                        </div>
                    </div>
                </section>
            })
        }
        else{
            return <div style={{textAlign: 'center', margin: '50px', fontSize: '25px'}}>No Questions Yet</div>
        }
    }

    renderNavComponent() {
        return <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>                        
                    </button>
                    <a href="/home"><img src="/images/log.jpg" alt="logo" className="img-responsive" /></a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                    <ul id="nav-menu" className="nav navbar-nav navbar-right">
                        <li><a href="index.html">About us</a></li>
                        <li><a href="about.html">Help & Support</a></li>
                        <li><a href="#">Contact us</a></li>
                        <li><a href="#" className="login">Login</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    }

    renderAddQuestionButton() {
        return <div className="add-question-button">
            <button type="button" className="btn btn-success" style={{background: '#31a2ff', marginRight: '10px'}} onClick={this.onClickAddQuestion}>Add New Question</button>
            <button type="button" className="btn btn-success" style={{background: '#31a2ff'}} onClick={this.onClickSaveQuiz}>Save this quiz</button>
        </div>
    }

    renderHiddenData() {
        if(typeof window == 'undefined'){
            if(this.props.quizID){
                return <span id='dataQuiz' style={{display: 'none'}}>{this.props.quizID}</span>
            }
            else{
                return <span id='dataPoll' style={{display: 'none'}}>{this.props.pollID}</span>
            }
        }
        else{
            return null;
        }
    }

    render() {
        return <div className="main">
            {this.renderNavComponent()}
            {this.renderTopComponent()}
            {this.renderQuestionList()}
            {this.renderAddQuestionButton()}
            {this.renderHiddenData()}
        </div>
    }

}