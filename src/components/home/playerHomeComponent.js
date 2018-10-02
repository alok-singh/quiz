import React, { Component } from 'react';
import {get, post} from '../../common/api';
import Modal from '../common/modal';

export default class QuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizList: [],
            quizPin: '',
            isModalVisible: false
        }
        this.onClickSubmitPin = this.onClickSubmitPin.bind(this);
        this.onClickEnterPinButton = this.onClickEnterPinButton.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;

        get('/api/quiz/all/', {
            authorization: apiToken
        }).then(data => {
            this.setState({
                quizList: data.quizzes ? data.quizzes : []
            });
        });
    }

    onClickCancel() {
        this.setState({
            isModalVisible: false
        })
    }

    onClickEnterPinButton() {
        this.setState({
            isModalVisible: true
        });
    }

    onClickSubmitPin() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;

        if(this.state.quizPin.length){
            post(`/api/verify/player/${this.state.quizPin.toUpperCase()}/`, null, {
                authorization: apiToken
            }).then(data => {
                alert(data.message);
                if(data.status == 201 || data.status == 400){
                    location.href = `/play/live/${this.state.quizPin.toUpperCase()}/`
                }
            });
        }
    }

    onChangeInput(key, value) {
        this.setState({
            [key]: value
        })
    }

    renderExplore() {
        return <section id="explore">
            <div className="container grid">
                <div className="row phead">
                    <div className="col-xs-9" >
                        <p style={{color: '#8800aa', textAlign: 'left', fontSize: '44px', lineHeight: '2.2', fontWeight: 'bold', marginBottom: '0px'}}>Konwledge Partner & Associates</p>
                    </div>
                    <div className="col-xs-3" >
                        <p style={{color: '#d8d8d8', textAlign: 'right', fontSize: '20px', lineHeight: '6', fontWeight: '500', marginBottom: '0px'}}>See All</p>
                    </div>
                </div>
                <div className="row phead">
                    <div className="col-md-3" >
                        <img className="img-responsive" src="/images/www.png" alt="img23"/>
                    </div>
                    <div className="col-md-3" >
                        <img className="img-responsive" src="/images/lop.png" alt="img23"/>
                    </div>
                    <div className="col-md-3" >
                        <img className="img-responsive" src="/images/ar.png" alt="img23"/>
                    </div>
                    <div className="col-md-3" >
                        <img className="img-responsive" src="/images/sc.png" alt="img23"/>
                    </div>
                </div>
            </div>
        </section>
    }

    renderExploreImage() {
        return <section>
            <img src="/images/ft.png" className="img-responsive"/>
        </section>
    }

    renderFooter() {
        return <footer id="foot" className="container-fluid bg-4 text-center">
            <div className="container">
                <div className="row">
                    <div className=" col-xs-12 col-md-3" style={{fontSize: '24px', textAlign: 'left'}}>
                        <p>About</p>
                        <p>Team</p>
                        <p>Partners</p>
                    </div>
                    <div className=" col-xs-12 col-md-3" style={{fontSize: '24px', textAlign: 'left', paddingTop: '35px'}}>
                        <p>Terms & Conditions</p>
                        <p>Privacy Policy</p>
                    </div>
                    <div className=" col-xs-12 col-md-3" style={{fontSize: '24px', textAlign: 'left'}}>
                        <p>Questions</p>
                        <p>How To Play</p>
                        <p>How To Host</p>
                    </div>
                    <div className=" col-xs-12 col-md-3" style={{fontSize: '24px', textAlign: 'center'}}>
                        <p><button className="btn">Download App</button></p>
                        <p><button className="btn" style={{padding: '5px 35px', marginTop: '15px'}}>Contact Us</button></p>
                    </div>
                </div>
                <div className="row" style={{paddingTop: '20px'}}>
                    <div className="col-xs-12 col-md-2">
                        <img src="images/ftlog.jpg" className="imf-responsive" />
                    </div>
                    <div className="col-xs-12 col-md-7" style={{paddingTop: '30px'}}>
                        <p style={{fontSize: '22px'}}>Copyright &copy; 2018, BrainItOn All Rights Reserved.</p>
                    </div>
                    <div className="col-xs-12 col-md-3">
                        <div className="row">
                            <div className="col-xs-3"><img src="/images/fbb.jpg" className="imf-responsive" /></div>
                            <div className="col-xs-3"><img src="/images/link.jpg" className="imf-responsive" /></div>
                            <div className="col-xs-3"><img src="/images/yout.jpg" className="imf-responsive" /></div>
                            <div className="col-xs-3"><img src="/images/inst.jpg" className="imf-responsive" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    }

    renderQuizzes() {
        return <section id="explore">
            <div className="container grid">
                <div className="row">
                    <div className="col-xs-12" >
                        <p style={{color: '#eb670f', textAlign: 'left', fontSize: '44px', lineHeight: '2.2', fontWeight: 'bold', marginBottom: '0px'}}>All Live Quizzes</p>
                    </div>
                </div>
                <div className="row">
                    {this.state.quizList.map(quiz => {
                        return <div className="col-md-3 goliath colblock ">
                            <div className="inner">
                                <figure className="effect-goliath">
                                    <img className="img-responsive" src="/images/eet.png" alt="img23"/>
                                    <figcaption>
                                        <h2><span>{quiz.quiz_title}</span></h2>
                                        <p style={{textAlign: 'left', fontSize: '14px'}}>{quiz.description}</p>
                                        <a href={`/play/quiz/${quiz.quiz_id}`}>Play</a>
                                    </figcaption>           
                                </figure>
                                <div>
                                    <div className="row">
                                        <div className="col-xs-12 btnblock">
                                            <a href={`/play/quiz/${quiz.quiz_id}`} className="btn btn-success " >Play Quiz</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    })}
                </div>
            </div>
        </section>
    }

    renderHeader() {
        return <section id="heads"  style={{background: '#8800aa'}}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 cont" >
                        <p style={{fontSize: '55px', fontWeight: '500', fontFamily: '\'Chango\', cursive', marginBottom: '0px'}}>Make Learning</p>
                        <p style={{fontSize: '60px', letterSpacing: '2.5px', lineHeight: '1', fontFamily: '\'Chango\', cursive', margin: '0px', marginBottom: '18px', fontWeight: '500'}}>Amazing..!</p>
                        <p style={{fontSize: '18px', margin : '0px'}}>Play Quizzes, Chanllenge Friends, </p>
                        <p style={{fontSize: '18px', marginBottom: '40px'}}>Compete with World, Learn Something Everyday</p>
                        <span><button type="button" className="btn btn-success " >Join Games</button></span><span><button type="button" className="btn btn-success " >Explore Games</button></span>
                    </div>
                    <div className="col-md-6 cont" >
                        <img className="img-responsive " src="/images/ws.jpg" alt="Chicago" />
                    </div>
                </div>
            </div>
        </section>
    }

    renderBottomHeader() {
        return  <section>
            <img src="/images/blbk.png" className="img-responsive" />
        </section>
    }

    renderNavBar() {
        return <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>                        
                    </button>
                    <a href="#"><img src="/images/lg.png" alt="logo" className="img-responsive" /></a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                    <ul id="nav-menu" className="nav navbar-nav navbar-right">
                        <li><a href="#">Play</a></li>
                        <li><a href="#">School</a></li>
                        <li><a href="#">Business</a></li>
                        <li><a href="#">Login</a></li>
                        <li><a href="#">Sign Up</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    }

    renderFixedFooter() {
        return <div className="btn-signin pin-button" onClick={this.onClickEnterPinButton}>
            Enter PIN
        </div>
    }

    renderModal() {
        return <Modal isVisible={this.state.isModalVisible} width="20%">
            <div className="content-wrapper" style={{padding: '15px', textAlign: 'center'}}>
                <h2 style={{color: '#333'}}>Enter PIN</h2>
                <div className="table-wrapper">
                    <div className="result-row">
                        <input value={this.state.quizPin} onChange={({target}) => this.onChangeInput('quizPin', target.value)} style={{width: '75%', height: '35px', margin: '20px 0px 30px', color: '#333', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '20px', paddingLeft: '8px'}}/>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={this.onClickSubmitPin}>Proceed</button>
                <button className="btn btn-primary" style={{marginLeft: '20px'}} onClick={this.onClickCancel}>Cancel</button>
            </div>
        </Modal>
    }

    render() {
        return <div className="player-home">
            {this.renderNavBar()}
            {this.renderHeader()}
            {this.renderBottomHeader()}
            {this.renderQuizzes()}
            {this.renderExplore()}
            {this.renderExploreImage()}
            {this.renderFooter()}
            {this.renderFixedFooter()}
            {this.renderModal()}
        </div>
    }
}