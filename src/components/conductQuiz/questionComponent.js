import React, { Component } from 'react';

const optionColors = [
    '#e21b3c',
    '#1368ce',
    '#d89e00',
    '#298f0d'
];

const optionStyles = color => {
    return {
        background: color,
        padding: '20px',
        color: '#fff',
        borderColor: '#fff',
        borderRadius: '16px',
        textAlign: 'center'
    }
}

export default class QuestionComponent extends Component {

    renderQuestion() {
        let questionObject = this.props.questionObject;
        if(questionObject){
            return <section id="titlebar">
                <div className="container">
                    <div className="row titlerow">
                        <div className="col-xs-3 col-md-2" >
                            <img src="/images/br.png" className="img-responsive logo" />
                        </div>
                        <div className="col-xs-9 col-md-8 text-center" >
                            <p style={{fontSize: '30px', color: '#000000', margin: '0px'}}>Question {this.props.currentQuestionNumber} of {this.props.totalQuestions}</p>
                        </div>
                        <div className="col-xs-2 hidden-sm hidden-xs"></div>
                    </div>
                    <div className="row smartimage">
                        <div className="col-xs-12 gap" style={{textAlign: 'right'}}>
                            <div style={{display: 'inline-block', height: '90px', width: '90px', textAlign: 'center', borderRadius: '50%', background: '#008ff8', marginTop: '10px', padding: '11px', color: '#fff'}}>
                                <span style={{fontSize: '30px', display: 'block'}}>{this.props.remainingTime}</span>
                                <span>Seconds</span>
                            </div>
                        </div>
                    </div>
                    <div className="row headrow">
                        <div className="col-xs-2 col-md-2"></div>
                        <div className="col-xs-12 col-md-8 text-center" >
                            <p style={{fontFamily: 'Hobo Std', fontSize: '46px', color: '#000000', margin: '0px'}}>{questionObject.question_title}</p>
                        </div>  
                        <div className="col-xs-2 col-md-2" ></div>
                    </div>
                    <div className="row questionbox">
                        {questionObject.options.map((option, index) => {
                            return <div className="col-xs-12 col-md-6" style={{postion: 'relative', marginBottom: '30px'}}>
                                <span className="btn" style={optionStyles(optionColors[index])}>{option.option_title}</span>
                            </div>
                        })}
                    </div>
                </div>
            </section>
        }
        else{
            return <div style={{fontSize: '20px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>No Questions Added in Quiz</div>
        }
    }

    renderNextButton() {
        if(this.props.remainingTime <= 0){
            return <div style={{textAlign: 'center', margin: '30px 0px'}}>
                <button onClick={this.props.onClickNext} className="btn btn-success" style={{height: '42px', width: '120px', fontSize: '16px', textTransform: 'capitalize', display: 'inline-block', background: '#0067d5', border: '1px solid #0067d5'}}>{this.props.currentQuestionNumber < this.props.totalQuestions ? 'next' : 'finish'}</button>
            </div>
        }
        else{
            return null;
        }
    }

    render() {
        return <div className="question">
            {this.renderQuestion()}
            {this.renderNextButton()}
        </div>
    }

}