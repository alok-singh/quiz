import React, { Component } from 'react';

export default class LeaderBoardComponent extends Component {

    renderTitleRow() {
        return <div className="row titlerow">
            <div className="col-xs-3 col-md-2" >
                <img src="/images/br.png" className="img-responsive logo" />
            </div>
            <div className="col-xs-9 col-md-8 text-center">
                <p style={{fontSize: '30px', margin: '0px'}}>Leaderboard</p>
            </div>
            <div className="col-xs-2 hidden-sm hidden-xs"></div>
        </div>
    }

    renderNextButton() {
        return <div className="row btnright">
            <div className="col-xs-12 gap" >
                <button type="button" className="btn btn-success pull-right" onClick={this.props.onClickNext} >Next</button>
            </div>
        </div>
    }

    renderTable() {
        return <div className="row tablerow" style={{padding: '10px'}}>
            <div className="col-md-3 hidden-sm hidden-xs" ></div>
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
                            {this.props.leaderBoardList.map(player => {
                                return <tr>
                                    <td width="20%">{player.rank}</td>
                                    <td width="40%">{player.name}</td>
                                    <td width="20%">{player.score}</td>
                                    <td width="20%">
                                        <span>{player.isCorrect ? <i className="fa fa-check" ></i> : <i className="fa fa-close"></i>}</span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>  
            <div className="col-md-3 hidden-sm hidden-xs"></div>
        </div>
    }

    render() {
        return <section id="titlebar" style={{background: '#33a7da', minHeight: '100vh'}}>
            <div className="container">
                {this.renderTitleRow()}
                {this.renderNextButton()}
                {this.renderTable()}
            </div>
        </section>
    }

}