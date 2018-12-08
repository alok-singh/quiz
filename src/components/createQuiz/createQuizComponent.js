import React, { Component } from 'react';
import {post} from '../../common/api';

export default class createQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizName: '',
            description: ''
        }
        this.onCreateQuiz = this.onCreateQuiz.bind(this);
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;

        if(apiToken && sessionKey){
            
        }
        else{
            location.href = '/login';
        }
    }

    onChangeInput(key, value) {
        this.setState({
            [key]: value
        });
    }

    onCreateQuiz() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        if(this.props.isPoll){
            if(this.state.quizName && this.state.description){
                post('/api/poll/', {
                    poll_name: this.state.quizName,
                    description: this.state.description,
                    poll_image: ""
                }, {
                    authorization: apiToken
                }).then(data => {
                    alert(data.message);
                    if(data.status == '200' && data.id){
                        location.href = `/poll/${data.id}/edit`
                    }
                })
            }
            else{
                alert('please enter Poll Name and description');
            }
        }
        else{
            if(this.state.quizName && this.state.description){
                post('/api/quiz/', {
                    quiz_name: this.state.quizName,
                    description: this.state.description,
                    image_url: "",
                    schools: [],
                    sponsors: []
                }, {
                    authorization: apiToken
                }).then(data => {
                    alert(data.message);
                    if(data.status == '200' && data.id){
                        location.href = `/quiz/${data.id}/edit`
                    }
                })
            }
            else{
                alert('please enter Quiz Name and description');
            }
        }
        
    }

    renderBottomComponent() {
        return  <section className="topcontent" >
            <div className="container">
                <div className="row titlerow" style={{padding: '25px 0px 0px'}}>
                    <div className="col-xs-12 col-md-8 " >
                        <div className="row">
                            <div className="col-xs-12" >
                                <p style={{fontSize: '20px', color: '#676767', fontWeight: 'bold', lineHeight: '34px', marginBottom: '15px'}} >{this.props.isPoll ? 'Poll Name' : 'Quiz Name'}</p>
                                <textarea rows="3" value={this.state.quizName} onChange={({target}) => this.onChangeInput('quizName', target.value)}></textarea>
                            </div>
                        </div>
                        <div className="row" style={{marginTop: '20px'}}>
                            <div className="col-xs-12" >
                                <p style={{fontSize: '20px', color: '#676767', fontWeight: 'bold', lineHeight: '34px', marginBottom: '15px'}} >Description</p>
                                <textarea rows="5" value={this.state.description} onChange={({target}) => this.onChangeInput('description', target.value)}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4 uploadsection" >
                        <div className="row">
                            <div className="col-xs-12 " >
                                <p style={{fontSize: '20px', color: '#676767', fontWeight: 'bold', lineHeight: '34px', marginBottom: '15px'}} >Add Cover Photo</p>
                                <div className="innerboxx text-center">
                                    <i className="fa fa-plus-circle" aria-hidden="true" style={{fontSize: '55px'}}></i>
                                    <hr />
                                    <p>
                                        <span>
                                            <button type="button" className="btn btn-success" style={{background: '#31a2ff'}} >Upload</button>
                                        </span>
                                        <span>
                                            <button type="button" className="btn btn-success" style={{background: '#b650cf'}} >Change</button>
                                        </span>
                                        <span>
                                            <button type="button" className="btn btn-success" style={{background: '#ff8f45'}} >Remove</button>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    }

    renderTopComponent() {
        return <section id="toptitle">
            <div className="row titlerow">
                <div className="col-xs-6 col-md-2" >
                    <a type="button" className="btn btn-success pull-left" style={{color: '#000000'}} href="/home">Cancel</a>
                </div>
                <div className="col-md-8 text-center hidden-sm hidden-xs" >
                    <p style={{fontWeight: 'bold', lineHeight: 1, fontSize: '30px', color: '#ffffff', margin: '0px'}}>{this.props.isPoll ? 'Create Poll' : 'Create Quiz'}</p>
                </div>
                <div className="col-xs-6 col-md-2" >
                    <button onClick={this.onCreateQuiz} type="button" className="btn btn-success pull-right" style={{color: '#000000'}}>Save & Next</button>
                </div>
            </div>
        </section>
    }

    renderNavComponent() {
        return <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>                        
                    </button>
                    <a href="#">
                        <img src="/images/log.jpg" alt="logo" className="img-responsive" />
                    </a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                    <ul id="nav-menu" className="nav navbar-nav navbar-right">
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Help & Support</a></li>
                        <li><a href="#">Contact us</a></li>
                        <li><a href="#" className="login">Login</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    }

    render() {
        return <div className="main">
            {this.renderNavComponent()}
            {this.renderTopComponent()}
            {this.renderBottomComponent()}
        </div>
    }
}