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
                <div className="table-wrapper-scroll-y tablescroll">
                    <table className="table">
                        <thead>
                             <tr>
                                <th scope="col">Rank</th>
                                <th scope="col">Name</th>
                                <th scope="col">Score</th>
                                <th scope="col">Response</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.leaderBoardList.map(player => {
                                return <tr>
                                    <th>{player.rank}</th>
                                    <td>{player.name}</td>
                                    <td>{player.score}</td>
                                    <td>
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