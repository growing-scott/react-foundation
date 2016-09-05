import React, {Component, PropTypes} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

class NTextArea extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: ""
        };
    }

    // Value값 변경에 따른 이벤트 처리
    handleChange(e) {
        console.info(e.target.value);
        this.setState({value: e.target.value});
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if (this.props.value) {
            this.setState({value: this.props.value});
        }
    }

    // setValue method
    setValue(value) {
        this.setState({value: value});
    }

    render() {
        return (
            <FormGroup ref={this.props.id} controlId={this.props.id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl componentClass="textarea" name={this.props.id} value={this.state.value} placeholder={this.props.placeholder} onChange={this.handleChange.bind(this)}/>
            </FormGroup>
        );
    }
}

NTextArea.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default NTextArea;
