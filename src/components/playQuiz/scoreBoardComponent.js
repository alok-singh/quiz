import React, { Component } from 'react';

export default class ScoreBoardComponent extends Component {


    renderTitleRow() {
        return <div className="row titlerow">
            <div className="col-xs-3 col-md-2" >
                <img src="/images/br.png" className="img-responsive logo" />
            </div>
            <div className="col-xs-9 col-md-8 text-center" >
                <p style={{fontSize: '30px', color: '#333', margin: '0px'}}>Question {this.props.currentQuestionNumber} of {this.props.totalQuestions}</p>
            </div>
            <div className="col-xs-2 hidden-sm hidden-xs"></div>
        </div>
    }

    renderPlayerResult() {
        return <div id="checkfa" className="row">
            <div className="col-xs-12 text-center innerrow">
                <p style={{margin: '0px'}}>
                    <span>{this.props.isPlayerCorrect ? <i className="fa fa-check" ></i> : <i className="fa fa-close"></i>}</span>
                </p>
                <p style={{fontSize: '40px'}}>{this.props.isPlayerCorrect ? "Correct" : (this.props.isPlayerCorrect == false ? "Incorrect" : "Not Answered")}</p>
            </div>
        </div>
    }

    renderPlayerStats() {
        return <div className="row" style={{color: '#ffffff'}}>
            <div className="col-xs-12 col-md-4 text-center" >
                <span style={{fontSize: '25px', fontWeight: 'bold', marginRight: '10px'}}>Your Score:</span> 
                <span style={{fontSize: '40px'}}>{this.props.playerScore}</span>
            </div>
            <div className="col-xs-12 col-md-4 text-center" >
                <span style={{fontSize: '25px', fontWeight: 'bold', marginRight: '10px'}}>Total Score:</span> 
                <span style={{fontSize: '40px'}}>{this.props.playerTotalScore}</span>
            </div>
            <div className="col-xs-12 col-md-4 text-center" >
                <span style={{fontSize: '25px', fontWeight: 'bold', marginRight: '10px'}}>Your Rank:</span> 
                <span style={{fontSize: '40px'}}>{this.props.playerRank}</span>
            </div>
        </div>
    }

    renderScoreBoard() {
        if(this.props.playerList){
            return <div className="row tablerow" style={{padding: '10px'}}>
                <div className="col-md-3 hidden-sm hidden-xs"></div>
                <div className="col-xs-12 col-md-6 " >
                    <table className="table" style={{color: '#fff'}}>
                        <thead>
                            <tr>
                                <th width="20%">Rank</th>
                                <th width="40%">Name</th>
                                <th width="20%">Score</th>
                                <th width="20%">Response</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="table-wrapper-scroll-y tablescroll">
                        <table className="table">
                            <tbody>
                                {this.props.playerList.map((player, index) => {
                                    return <tr>
                                        <td width="20%">{parseInt(index) + 1}</td>
                                        <td width="40%">{player.name}</td>
                                        <td width="20%">{player.score}</td>
                                        <td width="20%">{player.is_answer ? <i className="fa fa-check" ></i> : <i className="fa fa-close" ></i>}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>  
                <div className="col-md-3 hidden-sm hidden-xs"></div>
            </div>
        }
        else{
            return null;
        }
    }

    renderNextButton() {
        if(this.props.showNextButton){
            return <div style={{textAlign: 'center', margin: '30px 0px'}}>
                <button onClick={this.props.onClickNextScoreBoard} className="btn btn-success" style={{height: '42px', width: '120px', fontSize: '16px', textTransform: 'capitalize', display: 'inline-block', background: '#0067d5', border: '1px solid #0067d5'}}>Next</button>
            </div>
        }
        else{
            return null;
        }  
    }

    render() {
        return <section id="titlebar" style={{background: this.props.isPlayerCorrect ? "#78da33" : (this.props.isPlayerCorrect == false ? "#ff2c52" : "#3a9cee"), minHeight: '100vh'}}>
            <div className="container">
                {this.renderTitleRow()}
                {this.renderPlayerResult()}
                {this.renderPlayerStats()}
                {this.renderScoreBoard()}
                {this.renderNextButton()}
            </div>
        </section>
    }

}