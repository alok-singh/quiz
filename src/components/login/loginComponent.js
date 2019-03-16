import React, { Component } from 'react';
import Signin from './signin';
import {get, post} from '../../common/api';
import Loader from '../common/loader';

export default class QuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStage: 'signin',
            signupProgress: false,
            isLoading: false,
            sessionID: '',
            apiToken: '',
            mobileNumber: '',
            signupMobile: '',
            otp: '',
            fullName: ''
        }
        this.onChangeInput = this.onChangeInput.bind(this);
        this.switchToState = this.switchToState.bind(this);
        this.onClickReloadButton = this.onClickReloadButton.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }


    switchToState(toState) {
        this.setState({
            activeStage: toState,
            signupProgress: false,
            sessionID: '',
            isLoading: false,
            apiToken: '',
            mobileNumber: '',
            signupMobile: '',
            otp: '',
            fullName: ''
        })
    }

    onChangeInput(key, value) {
        this.setState({
            [key]: value
        })
    }

    onClickReloadButton() {
        location.reload();
    }

    onClickSubmit(action, actionURL) {
        let url = '';
        this.setState({
            isLoading: true
        })

        if(action == 'signin'){
            post(actionURL ? actionURL : '/api/user/login/', {
                user_id: this.state.mobileNumber
            }).then((data) => {
                if(data.session_id){
                    this.setState({
                        activeStage: 'otp',
                        sessionID: data.session_id,
                        isLoading: false,
                        signupProgress: false
                    }, () => {
                        if(data.message){
                            alert(data.message);
                        }
                        else{
                            alert('Something went wrong please try again.');
                            window.location.reload();
                        }
                    });
                }
                else{
                    this.setState({
                        isLoading: false
                    }, () => {
                        if(data.status == 405){
                            if(confirm(data.message)){
                                this.onClickSubmit('signin', '/api/user/login/other/device/');
                            }
                        }
                        else if(data.message){
                            alert(data.message);
                        }
                        else{
                            alert('Something went wrong please try again.');
                            window.location.reload();
                        }
                    });
                }
            }, (error) => {
                this.setState({
                    activeStage: 'signup',
                    sessionID: '',
                    isLoading: false,
                    apiToken: '',
                    mobileNumber: '',
                    signupMobile: '',
                    otp: '',
                    fullName: ''
                });
                alert('api failed');
            })
        }
        else if(action == 'signup'){
            post('/api/user/signup/', {
                user_id: this.state.signupMobile,
                name: this.state.fullName
            }).then((data) => {
                if(data.session_id){
                    this.setState({
                        activeStage: 'otp',
                        sessionID: data.session_id,
                        isLoading: false,
                        signupProgress: true
                    }, () => {
                        if(data.message){
                            alert(data.message);
                        }
                        else{
                            alert('Something went wrong please try again.');
                            window.location.reload();
                        }
                    });
                }
                else{
                    this.setState({
                        isLoading: false
                    });
                    if(data.message){
                        alert(data.message);
                    }
                    else{
                        alert('Something went wrong please try again.');
                        window.location.reload();
                    }
                }
            }, (error) => {
                this.setState({
                    activeStage: 'signup',
                    sessionID: '',
                    isLoading: false,
                    apiToken: '',
                    mobileNumber: '',
                    signupMobile: '',
                    otp: '',
                    fullName: ''
                });
                alert('api failed');
            })
        }
        else if(action == 'otp'){
            if(this.state.signupProgress){
                url = '/api/user/verify/';
            }
            else{
                url = '/api/user/login/verify/';
            }
            post(url, {
                mobile_otp: this.state.otp,
                otp: this.state.otp,
                session_id: this.state.sessionID
            }).then((data) => {
                if(data.api_token){
                    this.setState({
                        popupMessage: data.message,
                        apiToken: data.api_token,
                        isLoading: false,
                        role: data.role
                    }, () => {
                        localStorage.bqsid = this.state.sessionID;
                        localStorage.apitk = this.state.apiToken;
                        localStorage.role = this.state.role;
                        if(data.role == 'player'){
                            location.href = '/player-home'
                        }
                        else {
                            location.href = '/home';
                        }
                    });
                }
                else{
                    this.setState({
                        isLoading: false
                    });
                }
                if(data.message){
                    alert(data.message);
                }
                else{
                    alert('Something went wrong please try again.');
                    window.location.reload();
                }
            }, (error) => {
                this.setState({
                    activeStage: 'signup',
                    signupProgress: false,
                    sessionID: '',
                    isLoading: false,
                    apiToken: '',
                    mobileNumber: '',
                    otp: '',
                    fullName: ''
                });
                alert('api failed');
            })
        }
    }

    componentDidMount() {
        if(localStorage.apitk){
            if(localStorage.role == 'player'){
                location.href = '/';
            }
            else{
                location.href = '/home';
            }
        }
        else if(location.href.indexOf('sign-up') !== -1){
            this.setState({
               activeStage: 'signup' 
            });
        }
    }

    renderJSONData() {
        return typeof window == 'undefined' ? <div id="data" style={{display:'none'}}>{JSON.stringify(this.props.data)}</div> : null;
    }

    renderLoader() {
        return <Loader isLoading={this.state.isLoading} />
    }

    renderloginScreen() {
        return <Signin 
            mobileNumber={this.state.mobileNumber} 
            signupMobile={this.state.signupMobile} 
            onChangeInput={this.onChangeInput} 
            formType={this.state.activeStage} 
            switchToState={this.switchToState}
            onClickReloadButton={this.onClickReloadButton}
            onClickSubmit={this.onClickSubmit}
            otp={this.state.otp}
        />

    }

    render() {
        return <div className="container">
            {this.renderloginScreen()}
            {this.renderJSONData()}
            {this.renderLoader()}
        </div>
    }
}