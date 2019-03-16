import React, { Component } from 'react';
import {post, get, uploadImage} from '../../common/api';

export default class createQuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizName: '',
            description: '',
            category: '',
            imageURL: '',
            userName: 'Default'
        }
        this.onCreateQuiz = this.onCreateQuiz.bind(this);
        this.onUploadImage = this.onUploadImage.bind(this);
        this.onAddFile = this.onAddFile.bind(this); 
        this.onClickUploadButton = this.onClickUploadButton.bind(this); 
        this.signout = this.signout.bind(this);
    }

    componentDidMount() {
        let apiToken = localStorage.apitk;
        let formData = new FormData();
        
        this.reader = new FileReader();
        this.reader.onload = (event) => {
            this.setState({
                uploadImage: event.target.result
            }, () => {
                formData.append("image", this.uploadImageInput.files[0]);
                formData.append("folder", this.props.isPoll ? 'poll' : 'quiz');
                uploadImage(formData, apiToken).then(response => {
                    this.setState({
                        imageURL: response.image_url
                    })
                });
            });
        };
        this.reader.onerror = (event) => {
            console.error("File could not be read! Code " + event.target.error.code);
        };

        get('/api/user/name/', {
            authorization: apiToken
        }).then(data => {
            this.setState({
                userName: data.message ? data.message : 'Default'
            });
        });
        
        if(apiToken){
            this.uploadImageInput = document.getElementById('uploadImage');    
        }
        else{
            location.href = '/login';
        }
    }

    signout() {
        let apiToken = localStorage.apitk;
        this.setState({
            isLoading: true
        }, () => {
            post('/api/user/logout/', null, {
                authorization: apiToken
            }).then(data => {
                delete localStorage.apitk;
                delete localStorage.bqsid;
                this.setState({
                    isLoading: false
                }, () => {
                    location.href = '/login';
                })
            });
        });
    }

    onClickUploadButton() {
        this.uploadImageInput.click();
    }

    onUploadImage() {
        this.uploadImageInput.click();
    }

    onChangeInput(key, value) {
        this.setState({
            [key]: value
        });
    }

    onAddFile() {
        this.reader.readAsDataURL(event.target.files[0]);
    }

    onCreateQuiz() {
        let apiToken = localStorage.apitk;
        if(this.props.isPoll){
            if(this.state.quizName && this.state.description){
                post('/api/poll/', {
                    poll_name: this.state.quizName,
                    description: this.state.description,
                    poll_image: this.state.imageURL
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
                    image_url: this.state.imageURL,
                    category: this.state.category,
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
                        {this.props.isPoll ? null : <div className="row" style={{marginTop: '20px'}}>
                            <div className="col-xs-12" >
                                <p style={{fontSize: '20px', color: '#676767', fontWeight: 'bold', lineHeight: '34px', marginBottom: '15px'}} >Category</p>
                                <textarea rows="5" value={this.state.category} onChange={({target}) => this.onChangeInput('category', target.value)}></textarea>
                            </div>
                        </div>}
                    </div>
                    <div className="col-xs-12 col-md-4 uploadsection" >
                        <div className="row">
                            <div className="col-xs-12 " >
                                <p style={{fontSize: '20px', color: '#676767', fontWeight: 'bold', lineHeight: '34px', marginBottom: '15px'}} >Add Cover Photo</p>
                                <div className="innerboxx text-center">
                                    {this.state.uploadImage ? <img src={this.state.uploadImage} style={{height: '62px', maxWidth: '300px'}} /> : <i className="fa fa-plus-circle" aria-hidden="true" style={{fontSize: '55px'}} onClick={this.onUploadImage}></i>}
                                    <input type="file" id="uploadImage" style={{display: 'none'}} onChange={this.onAddFile}/>
                                    <hr />
                                    <p>
                                        <span>
                                            <button type="button" className="btn btn-success" style={{background: '#31a2ff'}} onClick={this.onClickUploadButton}>Upload</button>
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
                        <li><a href="#">{this.state.userName}</a></li>
                        <li><a href="#" className="login" onClick={this.signout}>Logout</a></li>
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