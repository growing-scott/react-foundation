import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';

import NLayoutA from './NLayoutA';
import NLayoutB from './NLayoutB';
import NLayoutC from './NLayoutC';
import NLayoutD from './NLayoutD';

class NModal extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            showModal: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open(){
        this.setState({
            showModal: true
        });
    }

    close(){
        this.setState({
            showModal: false
        });
    }

    render() {
        let layout = this.props.layout;
        let component;
        switch (layout.type) {
            case "A":
                component = (<NLayoutA ref={this.props.layout.id} firstArea={this.props.first} />);
                break;
            case "B":
                component = (<NLayoutB ref={this.props.layout.id} firstArea={this.props.first} secondArea={this.props.second}/>);
                break;
            case "C":
                component = (<NLayoutC ref={this.props.layout.id} firstArea={this.props.first} secondArea={this.props.second}/>);
                break;
            case "D":
                component = (<NLayoutD ref={this.props.layout.id} firstArea={this.props.first} secondArea={this.props.second} thirdArea={this.props.third}/>);
                break;
            default:
        }

        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close} bsSize="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.layout.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {component}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default NModal;
