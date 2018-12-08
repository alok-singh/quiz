import React, { Component } from 'react';

export default class PollResultComponent extends Component {
	render(){
		return <div>{this.props.resultQuestions ? JSON.stringify(this.props.resultQuestions) : 'No Result'}</div>
	}
}