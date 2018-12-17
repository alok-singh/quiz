import React, { Component } from 'react';
import {get, post} from '../../common/api';
import Loader from '../common/loader';

export default class MyResultComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            isLoading: false,
            quizzes: []
        }
        this.signout = this.signout.bind(this);
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

    onClickDownload(quizID) {
        window.open(`http://13.67.94.139/api/host/download/${quizID}`);
    }

    componentDidMount() {
        let apiToken = sessionStorage.apitk;
        let sessionKey = sessionStorage.bqsid;
        this.setState({
            isLoading: true
        })
        Promise.all([
            get('/api/user/name/', {
                authorization: apiToken
            }), 
            get('/api/host/results/', {
                authorization: apiToken
            })
        ]).then(([userData, quizData]) => {
            this.setState({
                userName: userData.message ? userData.message : 'Default',
                quizzes: quizData.quizzes ? quizData.quizzes : [],
                isLoading: false
            });
        });
    }

    renderSideContent() {
        return <div className="col-md-2 text-center" style={{background: '#8cc4fd'}} >
            <div className="row controw" style={{display: 'flex'}}>
                <div className="col-md-2 text-center" style={{background: '#8cc4fd', borderRight: '1px solid #d4d4d4', width: '27%'}} >
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
                </div>
            </div>
        </div>
    }

    renderHeadingTabs() {
        return <div className="row">
            <div className="col-xs-6 inner" style={{background: '#d4d4d4', width: '100%'}}><p>Polls and Quizzes</p></div>
        </div>
    }

    renderTable() {
        return <div className="row tablerows">
            <div className="col-xs-12">
                <div className="table-wrapper-scroll-y tablescroll" style={{color: '#4d4d4d'}}>
                    {this.state.quizzes.length ? <table className="table tablecont table-hover">
                        <thead>
                             <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Date</th>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.quizzes.map(quiz => {
                                let dateArr = (new Date(quiz.date)).toString().split(' ');
                                return <tr>
                                    <td>Quiz</td>
                                    <td>{`${dateArr[2]} ${dateArr[1]} ${dateArr[3]}`}</td>
                                    <td>{quiz.name}</td>
                                    <td><i className="fa fa-download" onClick={() => this.onClickDownload(quiz.id)}></i></td>
                                </tr>
                            })}
                        </tbody>
                    </table> : 'No Data found'}
                </div>
            </div>
        </div>
    }

    renderAdminContent() {
        return <section className="admincontent">
            <div className="container" >
                <div className="row controw" style={{display: 'flex'}}>
                    <div className="col-md-2 text-center" style={{background: '#8cc4fd', borderRight: '1px solid #d4d4d4', width: '27%'}} >
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
                    </div>
                    <div className="col-md-10 maincontent" style={{padding: '20px 100px 0px', width: '100%'}} >
                        {this.renderHeadingTabs()}
                        {this.renderTable()}
                    </div>
                </div>
            </div>
        </section>
    }

    renderLoader() {
        return <Loader isLoading={this.state.isLoading} />
    }

    renderAdmin() {
        return <section id="admin">
            <div className="container" >
                <div className="row titlerow">
                    <div className="col-xs-1 text-center bdright" style={{padding: '3px'}}>
                        <i className="fa fa-bars" ></i>
                    </div>
                    <div className="col-xs-9 text-center bdright" >
                        <img src="/images/br.png" className="img-responsive logo" style={{width: '120px', margin: '0 auto', padding: '10px'}} />
                    </div>
                    <div className="col-xs-2 text-center" style={{background: '#6dd2b0', padding: '11px'}} >
                        <button type="button" className="btn btn-success">{this.state.userName}</button>
                    </div>
                </div>
            </div>
        </section>
    }

    render() {
        return <div className="main">
            {this.renderAdmin()}
            {this.renderLoader()}
            {this.renderAdminContent()}
        </div>
    }
}