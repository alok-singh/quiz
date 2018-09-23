import React, { Component } from 'react';

export default class Signin extends Component {

	renderNav() {
		return <div className="nav">
	    	<ul className="links" style={{paddingLeft: '20px'}}>
	        	<li className="signin-active">
	        		<a className="btn" style={{background: '#de4935'}}>
	        			<span><i className="fa fa-google-plus" style={{marginRight: '15px'}}></i></span>
	        			<span>Sign in with google</span>
	        		</a>
	        	</li>
				<li className="signin-active">
					<a className="btn" style={{background: '#44649b'}}>
						<span><i className="fa fa-facebook" style={{marginRight: '15px'}}></i></span>
						<span>Sign in with facebook</span>
					</a>
				</li>
	      	</ul>
	    </div>
	}

	renderMessageText() {
		return <div className="msg text-center">
	        <p>---------------------- or sign in via OTP ----------------------</p>
	    </div>
	}

	renderForm() {
		const {formType} = this.props;
		if(formType == 'signin'){
			return <div className="form-signin">
				<label>Mobile</label>
				<input className="form-styling" type="text" name="otp" value={this.props.mobileNumber} onChange={({target}) => this.props.onChangeInput('mobileNumber', target.value)} />
				<div className="btn-animate">
	            	<a className="btn-signin" onClick={() => this.props.onClickSubmit('signin')}>Sign in</a>
	          	</div>
			</div>
		}
		else if(formType == 'signup'){
			return <div className="form-signin">
				<label>Full name</label>
				<input className="form-styling" type="text" name="fullname" value={this.props.fullName} onChange={({target}) => this.props.onChangeInput('fullName', target.value)} />
				<label>Mobile</label>
				<input className="form-styling" type="text" name="mobile" value={this.props.signupMobile} onChange={({target}) => this.props.onChangeInput('signupMobile', target.value)} />
				<div className="btn-animate">
					<a className="btn-signin" onClick={() => this.props.onClickSubmit('signup')}>Sign Up</a>
				</div>
			</div>
		}
		else if(formType == 'otp'){
			return <div className="form-signin">
				<label>OTP</label>
          		<input className="form-styling" type="text" name="otp" value={this.props.otp} onChange={({target}) => this.props.onChangeInput('otp', target.value)}/>
          		<div className="btn-animate">
            		<a className="btn-signin" onClick={() => this.props.onClickSubmit('otp')}>Submit</a>
          		</div>
         	</div>
		}
	}

	renderForgot() {
		let switchTo = this.props.formType == 'signup' ? 'signin' : 'signup';
		return <div className="forgot">
		  	<a className="pull-left" onClick={() => this.props.switchToState(switchTo)}>
		  		{this.props.formType == 'signup' ? `Already have account? Sign In` : `Don't have account? Sign Up`}
		  	</a>
	        <a onClick={() => this.props.switchToState('signin')} className="pull-right">Forgot password?</a>
	    </div>

	}
 
	renderReloadButton() {
		return <a id="refresh" value="Refresh" onClick={this.props.onClickReloadButton}>
			<i className="fa fa-undo"></i>
		</a>;
	}

    render() {
        return <div className="frame">
        	{this.renderNav()}
        	{this.renderMessageText()}
        	{this.renderForm()}
        	{this.renderForgot()}
        	{this.renderReloadButton()}
        </div>
    }

}
