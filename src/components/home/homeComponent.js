import React, { Component } from 'react';
import Modal from '../common/modal';
import {get, post, deleteReq} from '../../common/api';
import Loader from '../common/loader';

export default class QuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pollList: [],
            quizList: [],
            userName: 'Default',
            isPoll: false,
            isLoading: false,
            activeQuizID: false,
            isModalVisible: false,
            activeConductType: 'live',
            isSidebarVisible: true,
            searchInput: ''
        }
        this.signout = this.signout.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickConductModal = this.onClickConductModal.bind(this);
        this.delete = this.delete.bind(this);
    }

    signout() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        this.setState({
            isLoading: true
        }, () => {
            post('/api/user/logout/', null, {
                authorization: apiToken
            }).then(data => {
                delete sessionStorage.apitk;
                delete sessionStorage.bqsid;
                this.setState({
                    isLoading: false
                }, () => {
                    location.href = '/login';
                })
            });
        });
    }

    delete(type, id, name) {
        let apiToken = sessionStorage.apitk;
        let sessionID = sessionStorage.bqsid;
        let role = sessionStorage.role;
        if(confirm(`Are you sure you want to delete "${name}"?`)){
            deleteReq(`/api/${type}/${id}/`, {
                authorization: apiToken
            }).then(response => {
                if(response.status == 200){
                    if(response.message){
                        alert(response.message);
                    }
                    this.renderList();
                }
            })
        }
    }

    onChangeInput(val, key) {
        this.setState({
            [key]: val
        }, () => {
            if(key == 'searchInput'){
                if(this.timeout){
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.setState({
                        isLoading: true
                    }, () => {
                        this.renderList({
                            name: this.state.searchInput
                        });
                    })
                }, 500);
            }
        })
    }

    onClickConduct(quizID, quizIndex) {
        this.setState({
            isPoll: false,
            activeQuizID: quizID,
            isModalVisible: true
        })
    }

    onClickConductPoll(pollID, pollIndex) {
        this.setState({
            isPoll: true,
            activePollID: pollID,
            isModalVisible: true
        });
    }

    onClickConductModal() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;

        if(this.state.isPoll){
            post('/api/poll/generate/pin/', {
                poll_id: this.state.activePollID
            }, {
                authorization: apiToken
            }).then(data => {
                if(data.poll_pin && data.poll_id){
                    alert(data.message);
                    location.href = `/conduct/poll/${data.poll_id}/${data.poll_pin}/`;
                }
                else{
                    alert(data.message);
                }
            });
        }
        else{
            post('/api/generate/pin/', {
                quiz_id: this.state.activeQuizID
            }, {
                authorization: apiToken
            }).then(data => {
                if(data.quiz_pin && data.quiz_id){
                    alert(data.message);
                    location.href = `/conduct/live/${data.quiz_id}/${data.quiz_pin}/`;
                }
                else{
                    alert(data.message);
                }
            });
        }
    }

    onClickCancel() {
        this.setState({
            isModalVisible: false
        })
    }

    onChangeConductType(activeConductType) {
        this.setState({
            activeConductType
        });
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        this.renderList();
        get('/api/user/name/', {
            authorization: apiToken
        }).then(data => {
            this.setState({
                userName: data.message ? data.message : 'Default',
                isLoading: false
            });
        });
    }

    getQueryParamsFromObj(queryObj) {
        return Object.keys(queryObj).reduce((string, key) => {
            string = `${key}=${queryObj[key]}`;
            return string;
        }, '');
    }

    renderList(queryObj) {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        let role = sessionStorage.role;

        this.setState({
            isLoading: true
        });
        if(apiToken && sessionKey){
            if(role == 'host'){
                get(`/api/user/quizzes/?${queryObj ? this.getQueryParamsFromObj(queryObj) : ''}`, {
                    authorization: apiToken
                }).then(data => {
                    this.setState({
                        quizList: data.quizzes ? data.quizzes : [],
                        isLoading: false
                    });
                });
                get(`/api/poll/user/polls/?${queryObj ? this.getQueryParamsFromObj(queryObj) : ''}`, {
                    authorization: apiToken
                }).then(data => {
                    this.setState({
                        pollList: data.polls ? data.polls : [],
                        isLoading: false
                    });
                });
            }
            else{
                location.href = '/player-home';
            }
        }
        else{
            location.href = '/login';
        }
    }

    renderQuizList() {
        if(this.state.quizList.length){
            return <React.Fragment>
                {this.state.quizList.map((val, quizIndex) => {
                    return <div className="adminrow row tablerows">
                        <div className="col-xs-12">
                            <div className="row titlerow" >
                                <div className="col-xs-2 col-md-2 " >
                                    <img src={val.image} className="img-responsive pull-right" style={{minHeight: '95px', minWidth: '100%'}}/>
                                </div>
                                <div className="col-xs-6 col-md-7 head" >
                                    <p className="par1" >
                                        <a href={`/quiz/${val.id}/edit`} style={{marginRight: '10px'}}>{val.name}</a>
                                    </p>
                                    <p className="par2" >
                                        <span style={{marginRight: '22px'}}>Conducted 3 Times</span>
                                        <span>Created 4 days ago</span>
                                    </p>
                                    <p className="par1" >
                                        <span>
                                            <button type="button" className="btn btn-success" style={{color:'#000000'}}>Quiz</button>
                                        </span>
                                    </p>
                                </div>
                                <div className="col-xs-4 col-md-3 btnrow " >
                                    <div className="row">
                                        <div className="col-xs-12 gapp"><button type="button" className="btn btn-success pull-left" style={{padding: '10px 42px', fontSize: '17px', marginBottom: '5px'}} onClick={()=>{this.onClickConduct(val.id, quizIndex)}} >Conduct</button></div>
                                        <a className="col-xs-2 block" style={{marginLeft: '15px', marginRight: '5px'}} href={`/quiz/${val.id}/edit`}><i className="fa fa-pencil" style={{background: '#ff55dd'}} aria-hidden="true"></i></a>
                                        <div className="col-xs-2 block"><i className="fa fa-trash-o" style={{background: '#ff8080'}} aria-hidden="true" onClick={() => this.delete('quiz', val.id, val.name)}></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </React.Fragment>
        }
        else{
            return <span>No Quizzes yet</span>
        }
    }

    renderPollList() {
        if(this.state.pollList.length){
            return <React.Fragment>
                {this.state.pollList.map((val, quizIndex) => {
                    return <div className="adminrow row tablerows">
                        <div className="col-xs-12">
                            <div className="row titlerow" >
                                <div className="col-xs-2 col-md-2 " >
                                    <img src={val.image} className="img-responsive pull-right" style={{minHeight: '95px', minWidth: '100%'}}/>
                                </div>
                                <div className="col-xs-6 col-md-7 head" >
                                    <p className="par1" >
                                        <a href={`/poll/${val.id}/edit`} style={{marginRight: '10px'}}>{val.name}</a>
                                    </p>
                                    <p className="par2" >
                                        <span style={{marginRight: '22px'}}>Conducted 3 Times</span>
                                        <span>Created 4 days ago</span>
                                    </p>
                                    <p className="par1" >
                                        <span style={{marginRight: '22px'}}>
                                            <button type="button" className="btn btn-success" style={{color: '#000000'}}>Poll</button>
                                        </span>
                                    </p>
                                </div>
                                <div className="col-xs-4 col-md-3 btnrow " >
                                    <div className="row">
                                        <div className="col-xs-12 gapp"><button type="button" className="btn btn-success pull-left" style={{padding: '10px 42px', fontSize: '17px', marginBottom: '5px'}} onClick={()=>{this.onClickConductPoll(val.id, quizIndex)}} >Conduct</button></div>
                                        <a className="col-xs-2 block" style={{marginLeft: '15px', marginRight: '5px'}} href={`/poll/${val.id}/edit`}><i className="fa fa-pencil" style={{background: '#ff55dd'}} aria-hidden="true"></i></a>
                                        <div className="col-xs-2 block"><i className="fa fa-trash-o" style={{background: '#ff8080'}} aria-hidden="true" onClick={() => this.delete('poll', val.id, val.name)}></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </React.Fragment>
        }
        else{
            return <span>No Polls yet</span>
        }
    }

    renderAdminContent() {
        return <section className="admincontent">
            <div className="container" >
                <div className="row controw" style={{display: 'flex'}}>
                    {this.state.isSidebarVisible ? <div className="col-md-2 text-center" style={{background: '#8cc4fd', borderRight: '1px solid #d4d4d4', width: '27%'}} >
                        <div className="row">
                            <div className="col-xs-12 contblock " style={{background: '#ffffff', padding: '0px'}}>
                                <img src="/images/user.jpg" className="img-responsive "/>
                            </div>
                            <div className="col-xs-12 contblock">
                                <a href="/create">Create Quiz</a>
                            </div>
                            <div className="col-xs-12 contblock">
                                <a href="/create-poll">Create Poll</a>
                            </div>
                            <div className="col-xs-12 contblock"><a href="/my-results">My Results</a></div>
                            <div className="col-xs-12 contblock" onClick={this.signout}><p>Sign Out</p></div>
                        </div>
                    </div> : null}
                    <div className="col-md-10 maincontent" style={{padding: '20px 100px 0px', width: '100%'}} >
                        <div className="row">
                            <div className="main">
                                <div className="form-group has-feedback has-search">
                                    <input onChange={({target}) => this.onChangeInput(target.value, 'searchInput')} type="text" className="form-control" placeholder="Search from Quizzes/Polls" />
                                    <span className="fa fa-search form-control-feedback"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 " >
                                <p style={{fontSize: '25px', fontWeight: 'bold', marginLeft: '15px', marginBottom: '20px', color: 'rgba(0,0,0,0.38)'}}>Popular Quiz</p>
                            </div>
                        </div>
                        {this.renderQuizList()}
                        <div className="row">
                            <div className="col-xs-12 " >
                                <p style={{fontSize: '25px', fontWeight: 'bold', marginLeft: '15px', marginBottom: '20px', color: 'rgba(0,0,0,0.38)', marginTop: '30px'}}>Popular Polls</p>
                            </div>
                        </div>
                        {this.renderPollList()}
                    </div>
                </div>
            </div>
        </section>
    }

    renderModal() {
        return <Modal isVisible={this.state.isModalVisible} width='710px'>
            <div className="modal-body">
                <label className="radio-inline">
                    <input type="radio" name="optradio" onChange={() => {this.onChangeConductType('live')}} checked={this.state.activeConductType == 'live'} />PLAY LIVE
                </label>
                <label className="radio-inline">
                    <input type="radio" name="optradio" onChange={() => {this.onChangeConductType('pin')}} checked={this.state.activeConductType == 'pin'} />CHALLENGE VIA PIN GENERATION
                </label>
                <label className="radio-inline">
                    <input type="radio" name="optradio" onChange={() => {this.onChangeConductType('schedule')}} checked={this.state.activeConductType == 'schedule'} />ACTIVATE AS PER SCHEDULED
                </label>
            </div>
            <div className="modal-footer text-center">
                <button type="button" className="btn btn-primary" onClick={this.onClickConductModal}>CONDUCT</button>
                <button type="button" className="btn btn-primary" style={{marginLeft: '20px'}} onClick={this.onClickCancel}>CANCEL</button>
            </div>
        </Modal>

    }

    renderAdmin() {
        return <section id="admin">
            <div className="container">
                <div className="row titlerow">
                    <div className="col-xs-1 text-center bdright" style={{padding: '3px', cursor: 'pointer'}} onClick={() => this.setState({isSidebarVisible: !this.state.isSidebarVisible})}>
                        <i className="fa fa-bars"></i>
                    </div>
                    <div className="col-xs-9 text-center bdright">
                        <img src="/images/br.png" className="img-responsive logo" style={{width: '120px', margin: '0 auto', padding: '10px'}} />
                    </div>
                    <div className="col-xs-2 text-center" style={{background: '#6dd2b0', padding: '11px'}}>
                        <button type="button" className="btn btn-success">{this.state.userName.toUpperCase()}</button>
                    </div>
                </div>
            </div>
        </section>
    }

    renderLoader() {
        return <Loader isLoading={this.state.isLoading} />
    }

    render() {
        return <div className="main">
            {this.renderAdmin()}
            {this.renderAdminContent()}
            {this.renderModal()}
            {this.renderLoader()}
        </div>
    }
}