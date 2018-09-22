import React, { Component } from 'react';
import Signin from './signin';
import {get, post} from '../../common/api';
import Loader from './loader';

export default class QuizComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeStage: 'signin',
            signupProgress: false,
            sessionID: '',
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
            sessionID: '',
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

    onClickSubmit(action) {
        let url = '';
        
        this.setState({
            isLoading: true
        })

        if(action == 'signin'){
            post('/api/user/login/', {
                user_id: this.state.mobileNumber
            }).then((data) => {
                if(data.session_id){
                    this.setState({
                        activeStage: 'otp',
                        sessionID: data.session_id,
                        isLoading: false,
                        signupProgress: false
                    }, () => {
                        alert(data.message);
                    });
                }
                else{
                    this.setState({
                        isLoading: false
                    });
                    alert(data.message);
                }
            }, (error) => {
                this.setState({
                    activeStage: 'signup',
                    sessionID: '',
                    isLoading: false,
                    sessionID: '',
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
                        alert(data.message);
                    });
                }
                else{
                    this.setState({
                        isLoading: false
                    });
                    alert(data.message);
                }
            }, (error) => {
                this.setState({
                    activeStage: 'signup',
                    sessionID: '',
                    isLoading: false,
                    sessionID: '',
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
                        isLoading: false
                    });
                    sessionStorage.bqsid = this.state.sessionID;
                    sessionStorage.apitk = this.state.apiToken;
                    if(data.role == 'player'){
                        location.href = '/player-home'
                    }
                    else {
                        location.href = '/home';
                    }
                }
                else{
                    this.setState({
                        isLoading: false
                    });
                }
                alert(data.message);
            }, (error) => {
                this.setState({
                    activeStage: 'signup',
                    signupProgress: false,
                    sessionID: '',
                    isLoading: false,
                    sessionID: '',
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
        if(sessionStorage.bqsid && sessionStorage.apitk){
            location.href = '/home';
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