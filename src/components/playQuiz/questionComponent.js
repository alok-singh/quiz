import React, { Component } from 'react';

const optionColorList = [
    'rgba(226, 27, 60, 0.6)',
    'rgba(19, 104, 206, 0.6)',
    'rgba(216, 158, 0, 0.6)',
    'rgba(41, 143, 13, 0.6)'
];
const selectedColorList = [
    'rgb(226, 27, 60)',
    'rgb(19, 104, 206)',
    'rgb(216, 158, 0)',
    'rgb(41, 143, 13)'
];


export default class QuestionComponent extends Component {

    render() {
        let questionObject = this.props.questionObject;
        return <section id="titlebar">
            <div className="container">
                <div className="row titlerow">
                    <div className="col-xs-3 col-md-2" >
                        <img src="/images/br.png" className="img-responsive logo" />
                    </div>
                    <div className="col-xs-9 col-md-8 text-center" >
                        <p style={{fontFamily: 'Hobo Std', fontSize: '30px', color: '#000000', margin: '0px'}}>Question {this.props.currentQuestion} of {this.props.totalQuestions}</p>
                    </div>
                    <div className="col-xs-2 hidden-sm hidden-xs " >
                        
                    </div>
                </div>
                <div className="row smartimage">
                    <div className="col-xs-12 gap" style={{textAlign: 'right'}}>
                        <div style={{display: 'inline-block', height: '90px', width: '90px', textAlign: 'center', borderRadius: '50%', background: '#008ff8', marginTop: '10px', padding: '11px', color: '#fff'}}>
                            <span style={{fontSize: '30px', display: 'block'}}>{this.props.currentTimeout}</span>
                            <span>Seconds</span>
                        </div>
                    </div>
                </div>
                <div className="row headrow">
                    <div className="col-xs-2 col-md-2" >
                        
                    </div>
                    <div className="col-xs-12 col-md-8 text-center" >
                        <p style={{fontFamily: 'Hobo Std', fontSize: '46px', color: '#000000', margin: '0px'}}>{questionObject.question_title}</p>
                    </div>  
                    <div className="col-xs-2 col-md-2" >
                        
                    </div>
                </div>
                <div className="row quesbtn">
                    {questionObject.options.map((option, index) => {
                        return <div className="col-xs-6" >
                            <button onClick={() => this.props.onClickAnswer(index)} type="button" className="btn btn-success btn-block" style={{background: option.is_answer ? selectedColorList[index] : optionColorList[index]}}>{option.option_title}</button>
                        </div>
                    })}
                </div>
            </div>
        </section>
    }
}