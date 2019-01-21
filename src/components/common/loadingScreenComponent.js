import React, { Component } from 'react';


export default class LoadingScreenComponent extends Component {
    render() {
        return <section id="titlebar">
            <div className="container">
                <div className="row titlerow">
                    <div className="col-xs-12" >
                        <img src="/images/br.png" className="img-responsive" style={{height: '32px', marginTop: '3px'}}/>
                    </div>
                </div>
                <div className="row smartimage">
                    <div className="col-xs-1 col-md-2 hidden-sm hidden-xs" >
                        
                    </div>
                    <div className="col-xs-10 col-md-8" >
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-xs-12" >
                        <p style={{fontSize: '44px', color: '#333', marginTop: '50px'}}>Instructions</p>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-md-2 hidden-sm hidden-xs"></div>
                    <div className="col-md-4 par" >
                        <p><span><i className="fa fa-check" ></i></span><span>Quick response for more points</span></p>
                        <p><span><i className="fa fa-check" ></i></span><span>Quick response for more points</span></p>
                    </div>  
                    <div className="col-md-4 par" >
                        <p><span><i className="fa fa-check" ></i></span><span>Correct streak for bonus points</span></p>
                        <p><span><i className="fa fa-check" ></i></span><span>Correct streak for bonus points</span></p>
                    </div>
                    <div className="col-md-2 hidden-sm hidden-xs"></div>
                </div>
                <div className="row loadbtn">
                    <div className="col-xs-1 col-md-2 "></div>
                    <div className="col-xs-10 col-md-8 par" >
                        <span type="button" className="btn btn-success btn-block ">
                            <span className="compleated" style={{width: `${this.props.loaded}%`}}></span>
                            <span className="loading-text">Loading Question {this.props.loaded}%</span>
                        </span>
                    </div>
                    <div className="col-xs-1 col-md-2 "></div>
                </div>
            </div>
        </section>
    }
}