import React, { Component } from 'react';
import {get, post} from '../../common/api';
import Modal from '../common/modal';

export default class QuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizList: [],
            featuredQuizzes: [],
            quizPin: '',
            categories: '',
            isModalVisible: false
        }
        this.onClickSubmitPin = this.onClickSubmitPin.bind(this);
        this.onClickEnterPinButton = this.onClickEnterPinButton.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickPlayQuiz = this.onClickPlayQuiz.bind(this);
        this.signout = this.signout.bind(this);
    }

    signout() {
        let apiToken = localStorage.apitk;
        this.setState({
            isLoading: true
        }, () => {
            if(confirm("Are you sure you want to logout?")){
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
            }
        });
    }

    componentDidMount() {
        let apiToken = localStorage.apitk;
        
        get('/api/quiz/all/', {
            authorization: apiToken
        }).then(data => {
            this.setState({
                quizList: data.quizzes ? data.quizzes : [],
                featuredQuizzes: data.featured_quizzes ? data.featured_quizzes : [],
                categories: data.categories ? data.categories : ''
            });
        });
    }

    onClickPlayQuiz() {
        let apiToken = localStorage.apitk;
        if(apiToken){

        }
        else{
            event.preventDefault();
            if(confirm('Please sign in to play quiz')){
                window.location.href = '/login';
            }
        }
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
        let url = '';
        let apiToken = localStorage.apitk;
        let pin = this.state.quizPin;
        if(pin.length){
            if(pin[0].toLowerCase() == 'p'){
                post(`/api/poll/verify/player/${this.state.quizPin.toUpperCase()}/`, null, {
                    authorization: apiToken
                }).then(data => {
                    alert(data.message);
                    if(data.status == 200 && data.poll_id){
                        location.href = `/play/poll/${data.poll_id}/${this.state.quizPin.toUpperCase()}/`
                    }
                });
            }
            else{
                post(`/api/verify/player/${this.state.quizPin.toUpperCase()}/`, null, {
                    authorization: apiToken
                }).then(data => {
                    alert(data.message);
                    if(data.status == 200 && data.quiz_id){
                        location.href = `/play/live/${data.quiz_id}/${this.state.quizPin.toUpperCase()}/`
                    }
                });
            }
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
                        <p style={{color: '#8800aa', textAlign: 'left', fontSize: '44px', lineHeight: '2.2', fontWeight: 'bold', marginBottom: '0px'}}>Knowledge Partner & Associates</p>
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

    renderQuizzes(quizList, text) {
        let defaultImageURL = "/images/eet.png";
        text = text ? text : "Others";
        return <section className="explore">
            <div className="container grid">
                <div className="row">
                    <div className="col-xs-12" >
                        <p className="dynamic-text">{text}</p>
                    </div>
                </div>
                <div className="row">
                    {quizList.map(quiz => {
                        return <div className="col-md-4 goliath colblock ">
                            <div className="inner">
                                <figure className="effect-goliath">
                                    <div className="quiz-image" style={{backgroundImage: `url('${quiz.image_url ? quiz.image_url : defaultImageURL}')`}}></div>
                                    <figcaption>
                                        <h2><span>{quiz.quiz_title}</span></h2>
                                        <p style={{textAlign:'left', fontSize:'14px'}}>{quiz.description}</p>
                                    </figcaption>
                                </figure>
                                <div>
                                    <div className="row">
                                        <div className="col-xs-2">
                                            <p className="pg" style={{padding: '5px 0px 15px', paddingLeft: '30px', whiteSpace: 'nowrap'}}>by {quiz.host_name}</p>
                                        </div>
                                        <div className="col-xs-5">
                                            <span></span>
                                        </div>
                                        <div className="col-xs-5">
                                            <button type="button" className="btn btn-success"><a onClick={this.onClickPlayQuiz} style={{color: '#fff'}} href={`/play/quiz/${quiz.quiz_id}`}>Play</a></button>
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
                        <p className="home-page-line-1">Make Learning</p>
                        <p className="home-page-line-2">Amazing..!</p>
                        <p className="home-page-line-3">Play Quizzes, Challenge Friends, </p>
                        <p className="home-page-line-4">Compete with World, Learn Something New Everyday</p>
                        <span>
                            <button type="button" className="btn btn-success" onClick={this.onClickEnterPinButton} >Join Games</button>
                        </span>
                        <span>
                            <button type="button" className="btn btn-success" onClick={() => {location.href = '/sign-up'}}>Sign Up</button>
                        </span>
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
        let apiToken = typeof window == 'undefined' ? '' : localStorage.apitk;
        return <nav className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header">
                    {apiToken ? '' : <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar" style={{margin: '0px'}}>
                        <a href="/sign-up">Signup</a>
                    </button>}
                    {apiToken ? <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar" style={{margin: '0px'}}>
                        <a href="#" onClick={this.signout}>Logout</a>
                    </button> : <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar" style={{margin: '0px'}}>
                        <a href="/login" >Login</a>
                    </button>}
                    <a href="#"><img src="/images/lg.png" alt="logo" className="img-responsive" /></a>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                    <ul id="nav-menu" className="nav navbar-nav navbar-right">
                        <li>
                            {apiToken ? '' : <a href="/sign-up">Signup</a>}
                        </li>
                        <li>
                            {apiToken ? <a href="#" onClick={this.signout}>Logout</a> : <a href="/login" >Login</a>}
                        </li>
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
        return <Modal isVisible={this.state.isModalVisible}>
            <div className="content-wrapper" style={{padding: '15px', textAlign: 'center'}}>
                <h2 style={{color: '#333'}}>Enter PIN</h2>
                <div className="table-wrapper">
                    <div className="result-row">
                        <input value={this.state.quizPin} onChange={({target}) => this.onChangeInput('quizPin', target.value)} style={{width: '75%', height: '35px', margin: '20px 0px 30px', color: '#333', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '20px', paddingLeft: '8px', border: '1px solid #333'}}/>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={this.onClickSubmitPin}>Proceed</button>
                <button className="btn btn-primary" style={{marginLeft: '20px'}} onClick={this.onClickCancel}>Cancel</button>
            </div>
        </Modal>
    }

    renderHomePageLists() {
        let quizBucketComponent = [];
        let categoryNameObject = {};
        let categoryIDBucket = this.state.quizList.reduce((acc, quiz) => {
            if(quiz.category_id){
                if(acc[quiz.category_id]){
                    acc[quiz.category_id].push(quiz);
                }
                else{
                    acc[quiz.category_id] = [quiz];
                }
            }
            else{
                if(acc['others']){
                    acc['others'].push(quiz);
                }
                else{
                    acc['others'] = [quiz];
                }
            }
            return acc;
        }, {});
        
        if(this.state.categories && this.state.quizList && this.state.quizList.length){
            categoryNameObject = this.state.categories.reduce((acc, category) => {
                acc[category.category_id] = category.category_name;
                return acc;
            }, {})
            quizBucketComponent = Object.keys(categoryIDBucket).map(categoryID => {
                return this.renderQuizzes(categoryIDBucket[categoryID], categoryNameObject[categoryID]);
            })
        }

        return <React.Fragment>
            {this.renderQuizzes(this.state.featuredQuizzes, 'Featured Quizzes')}
            {quizBucketComponent}
        </React.Fragment>
    }

    render() {
        return <div className="player-home">
            {this.renderNavBar()}
            {this.renderHeader()}
            {this.renderBottomHeader()}
            {this.renderHomePageLists()}
            {this.renderExplore()}
            {this.renderExploreImage()}
            {this.renderFooter()}
            {this.renderFixedFooter()}
            {this.renderModal()}
        </div>
    }
}