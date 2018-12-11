import React, { Component } from 'react';

export default class PollResultComponent extends Component {
	renderHeader() {
        return <div className="header-bar">
        	<img src="/images/br.png" className="img-responsive logo" />
        	<a href={this.props.homeURL} className="home-link">Home</a>
        </div>
    }
    
    renderPollName() {
    	return <h1 className="u-text-center">
    		{this.props.pollName ? this.props.pollName : 'Overall responses of poll'}
    	</h1>
    }

    renderTableName() {
    	return <h2 className="u-text-center">
    		All Responses
    	</h2>
    }

    renderTable() {
    	return <div className="u-text-center poll-table">
    		{this.props.resultQuestions.map(question => {
    			return <div className="question-box">
	    			<div className="question">{question.question_text}</div>
	    			{question.options.map(response => {
	    				return <div className="option">
		    				<div className="flex-wrapper">
			    				<div className="radio">
			    					<div className="circle"></div>
			    				</div>
			    				<div className="option-text">
			    					{response.option}
			    				</div>
			    			</div>
			    			<div className="flex-wrapper">
			    				<div className="percent">{response.option_percent ? Math.round(response.option_percent*100) : '0'}%</div>
			    				<div className="bar">
			    					<div className="solid" style={{width: `${Math.round(response.option_percent*100)}%`}}></div>
			    				</div>
			    			</div>
		    			</div>
	    			})}
	    		</div>
    		})}
    	</div>
    }

	render(){
		return <div className="content poll-result">
			{this.renderHeader()}
			{this.renderPollName()}
			{this.renderTableName()}
			{this.renderTable()}
		</div>
	}
}