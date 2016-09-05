import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, InputGroup, Glyphicon, HelpBlock} from 'react-bootstrap';

class NAddOnIconTextField extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: ""
        };
    }

    // Value값 변경에 따른 이벤트 처리
    handleChange(e) {
        this.setState({value: e.target.value});
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if (this.props.value) {
            this.setState({value: this.props.value});
        }
    }

    render() {
        return (
            <FormGroup controlId={this.props.id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <InputGroup>
                    <FormControl type="text" name={this.props.id} value={this.state.value} placeholder={this.props.placeholder} onChange={this.handleChange.bind(this)}/>
                    <InputGroup.Addon>
                        <Glyphicon glyph="music" onClick={() => alert('1')}/>
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        );
    }
}

NAddOnIconTextField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default NAddOnIconTextField;
