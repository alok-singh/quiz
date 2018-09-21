import React, { Component } from 'react';
import {get, post} from '../../common/api';

export default class QuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizList: []
        }
        this.signout = this.signout.bind(this);
    }

    signout() {
        delete sessionStorage.apitk;
        delete sessionStorage.bqsid;
        location.href = '/login';
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        
        if(apiToken && sessionKey){
            get('/api/user/quizzes/', {
                authorization: apiToken
            }).then(data => {
                this.setState({
                    quizList: data.quizzes ? data.quizzes : []
                });
            })
        }
        else{
            location.href = '/login';
        }
    }

    renderQuizList() {
        if(this.state.quizList.length){
            return <React.Fragment>
                {this.state.quizList.map(val => {
                    return <div className="adminrow row tablerows">
                        <div className="col-xs-12">
                            <div className="row titlerow" >
                                <div className="col-xs-2 col-md-2 " >
                                    <img src={val.image} className="img-responsive pull-right" style={{minHeight: '95px', minWidth: '100%'}}/>
                                </div>
                                <div className="col-xs-6 col-md-7 head" >
                                    <p className="par1" >
                                        <a href={`/quiz/${val.id}/edit`} style={{marginRight: '10px'}}>{val.name}</a>
                                        <span>
                                            <button type="button" className="btn btn-success" style={{color:'#000000'}}>Quiz</button>
                                        </span>
                                    </p>
                                    <p className="par2" >
                                        <span style={{marginRight: '22px'}}>Conducted 3 Times</span>
                                        <span>Created 4 days ago</span>
                                    </p>
                                    <p className="par1" >
                                        <span style={{marginRight: '22px'}}>
                                            <button type="button" className="btn btn-success" style={{color: '#000000'}}>Show Results</button>
                                        </span>
                                        <span>
                                            <button type="button" className="btn btn-success" style={{color: '#000000'}}>Show Stats</button>
                                        </span>
                                    </p>
                                </div>
                                <div className="col-xs-4 col-md-3 btnrow " >
                                    <div className="row">
                                        <div className="col-xs-12 gapp"><button type="button" className="btn btn-success pull-left" style={{padding: '10px 42px', fontSize: '17px', marginBottom: '5px'}} >Conduct</button></div>
                                        <div className="col-xs-2 block" style={{marginLeft: '30px'}}><i className="fa fa-star" style={{background: '#ff9955'}} aria-hidden="true"></i></div>
                                        <div className="col-xs-2 block"><i className="fa fa-pencil" style={{background: '#ff55dd'}} aria-hidden="true"></i></div>
                                        <div className="col-xs-2 block"><i className="fa fa-clone" style={{background: '#b380ff'}} aria-hidden="true"></i></div>
                                        <div className="col-xs-2 block"><i className="fa fa-trash-o" style={{background: '#ff8080'}} aria-hidden="true"></i></div>
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

    renderAdminContent() {
        return <section className="admincontent">
            <div className="container" >
                <div className="row controw">
                    <div className="col-md-2 text-center" style={{background: '#8cc4fd'}} >
                        <div className="row">
                            <div className="col-xs-12 contblock " style={{background: '#ffffff', padding: '0px'}}>
                                <img src="images/user.jpg" className="img-responsive "/>
                            </div>
                            <div className="col-xs-12 contblock">
                                <a href="/create">Create Quiz</a>
                            </div>
                            <div className="col-xs-12 contblock"><p>Search Quiz</p></div>
                            <div className="col-xs-12 contblock"><p>My Creations</p></div>
                            <div className="col-xs-12 contblock"><p>My Results</p></div>
                            <div className="col-xs-12 contblock"><p>Org Accounts</p></div>
                            <div className="col-xs-12 contblock"><p>Account Setting</p></div>
                            <div className="col-xs-12 contblock" onClick={this.signout}><p>Sign Out</p></div>
                            <div className="col-xs-12 contblock" style={{padding: '57px'}}>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 maincontent" style={{padding: '20px 100px 0px'}} >
                        <div className="row">
                            <div className="main">
                                <div className="form-group has-feedback has-search">
                                    <input type="text" className="form-control" placeholder="Search from Quizzes/Polls/Tournaments" />
                                    <span className="fa fa-search form-control-feedback"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 " >
                                <p style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '15px', marginBottom: '20px'}}>Popular Quiz</p>
                            </div>
                        </div>
                        {this.renderQuizList()}
                    </div>
                </div>
            </div>
        </section>
    }

    renderAdmin() {
        return <section id="admin">
            <div className="container">
                <div className="row titlerow">
                    <div className="col-xs-1 text-center bdright" style={{padding: '3px'}}>
                        <i className="fa fa-bars"></i>
                    </div>
                    <div className="col-xs-9 text-center bdright">
                        <img src="/images/br.png" className="img-responsive logo" style={{width: '120px', margin: '0 auto', padding: '10px'}} />
                    </div>
                    <div className="col-xs-2 text-center" style={{background: '#6dd2b0', padding: '11px'}}>
                        <button type="button" className="btn btn-success">DEEPAK</button>
                    </div>
                </div>
            </div>
        </section>
    }

    render() {
        return <div className="main">
            {this.renderAdmin()}
            {this.renderAdminContent()}
        </div>
    }
}