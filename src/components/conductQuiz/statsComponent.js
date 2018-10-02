import React, { Component } from 'react';

const optionColors = [
    '#e21b3c',
    '#8fb2dc',
    '#dcc178',
    '#91c583'
];

const barColor = [
    '#e11b3c',
    '#1368ce',
    '#dcc178',
    '#91c582'
]

const optionStyles = index => {
    return {
        background: optionColors[index],
        whiteSpace: 'normal',
        paddingRight: '80px'
    }
};

const iconStyles = (color) => {
    return {
        color: color,
        position: 'absolute',
        top: '50%',
        right: '0',
        transform: 'translate(-50%, -50%)',
        height: '80px'
    }
};

export default class StatsComponent extends Component {

    renderQuestionBox() {
        let questionObj = this.props.questionObj;
        return <div className="row quesbtn">
            {questionObj.options.map((option, index) => {
                return <div className="col-xs-6" style={{position: 'relative'}}>
                    <span className="btn btn-success btn-block" style={optionStyles(index)} >{option.option_title}</span>
                    {option.is_answer ? <p><span><i className="fa fa-check" style={iconStyles('rgb(0, 255, 0)')}></i></span></p> : <p><span><i className="fa fa-close" style={iconStyles('#ff0000')}></i></span></p>}
                </div>
            })}
        </div>
    }

    renderLogo() {
        return <div className="row smartimage" style={{opacity: 0}}>
            <div className="col-xs-12 gap" >
                <img src="/images/cnt.png" className="img-responsive pull-right" />
            </div>
        </div>
    }

    renderHeaderRow() {
        return <div id="headrow" className="row headrow" style={{padding: '0px'}}>
            <div className="col-xs-2 col-md-2" ></div>
            <div className="col-xs-12 col-md-8 text-center hd" style={{marginTop: '-40px'}}>
                <p style={{fontSize: '40px', margin: '0px'}} >{this.props.questionObj.question_title}</p>
            </div>  
            <div className="col-xs-2 col-md-2" ></div>
        </div>
    }

    renderHeader() {
        return <div className="row titlerow">
            <div className="col-xs-3 col-md-2" >
                <img src="/images/br.png" className="img-responsive logo" />
            </div>
            <div className="col-xs-9 col-md-8 text-center" >
                <p style={{fontSize: '30px', margin: '0px'}} >Question {this.props.currentQuestionNumber} of {this.props.totalQuestions}</p>
            </div>
            <div className="col-xs-2 hidden-sm hidden-xs"></div>
        </div>
    }

    renderGraph() {
        let {optionACount, optionBCount, optionCCount, optionDCount} = this.props;
        let totalResponses = [optionACount, optionBCount, optionCCount, optionDCount].reduce((sum, val) => {
            return sum + parseInt(val);
        }, 0);
        return <div className="graph">
            <div className="entity">
                <div className="count" style={{color: barColor[0]}}>{optionACount}</div>
                <div className="bar" style={{backgroundColor: barColor[0], height: `${parseInt((200*optionACount)/totalResponses)}px`}}></div>
                <div className="correct" style={{backgroundColor: barColor[0]}}><i className="fa fa-check"></i></div>
            </div>
            <div className="entity">
                <div className="count" style={{color: barColor[1]}}>{optionBCount}</div>
                <div className="bar" style={{backgroundColor: barColor[1], height: `${parseInt((200*optionBCount)/totalResponses)}px`}}></div>
                <div className="correct" style={{backgroundColor: barColor[1]}}><i className="fa fa-close"></i></div>
            </div>
            <div className="entity">
                <div className="count" style={{color: barColor[2]}}>{optionCCount}</div>
                <div className="bar" style={{backgroundColor: barColor[2], height: `${parseInt((200*optionCCount)/totalResponses)}px`}}></div>
                <div className="correct" style={{backgroundColor: barColor[2]}}><i className="fa fa-close"></i></div>
            </div>
            <div className="entity">
                <div className="count" style={{color: barColor[3]}}>{optionDCount}</div>
                <div className="bar" style={{backgroundColor: barColor[3], height: `${parseInt((200*optionDCount)/totalResponses)}px`}}></div>
                <div className="correct" style={{backgroundColor: barColor[3]}}><i className="fa fa-close"></i></div>
            </div>
        </div>
    }

    renderNextButton() {
        return <div style={{textAlign: 'center', margin: '30px 0px'}}>
            <button onClick={this.props.onClickNext} className="btn btn-success" style={{height: '42px', width: '120px', fontSize: '16px', textTransform: 'capitalize', display: 'inline-block', background: '#0067d5', border: '1px solid #0067d5'}}>{this.props.currentQuestionNumber < this.props.totalQuestions ? 'next' : 'finish'}</button>
        </div>
    }

    render() {
        return <section id="titlebar" className="stats">
            <div className="container">
                {this.renderHeader()}
                {this.renderLogo()}
                {this.renderHeaderRow()}
                {this.renderGraph()}
                {this.renderQuestionBox()}
                {this.renderNextButton()}
            </div>
        </section>
    }

}