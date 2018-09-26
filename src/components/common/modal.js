import React, { Component } from 'react';

export default class Modal extends Component {

    render() {
        if(this.props.isVisible){
            return <div className="modal" style={{display: 'block'}}>
                <div className="modal-dialog" style={{width: this.props.width ? this.props.width : 'auto'}}>
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
