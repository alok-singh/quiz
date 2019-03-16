import React, { Component } from 'react';

export default class Modal extends Component {

    render() {
        if(this.props.isVisible){
            return <div className="modal" style={{display: 'block'}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        }
        else{
            return null;
        }
    }
}
