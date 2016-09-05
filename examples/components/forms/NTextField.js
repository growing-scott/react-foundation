import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

class NTextField extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: "",
            visible: true
        };
        this.setValue = this.setValue.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        this.setState({visible: this.props.visible});
    }

    // setValue method
    setValue(value) {
        this.setState({value: value});
    }

    // Value값 변경에 따른 이벤트 처리
    handleChange(e) {
        console.info(e.target.value);
        console.info(e.target.value);
        this.setState({value: e.target.value});
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if (this.props.value) {
            this.setState({value: this.props.value});
        }
    }

    // Props 변경 이벤트
    componentWillReceiveProps(nextProps) {
        // Props 변경으로 Visible 제어(true|false)
        if (this.props.visible !== nextProps.visible) {
            this.setState({visible: nextProps.visible});
        }
    }

    render() {
        return (
            <FormGroup ref={this.props.id} controlId={this.props.id} className={this.state.visible
                ? 'block'
                : 'hidden'}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl type="text" name={this.props.id} value={this.state.value} placeholder={this.props.placeholder} onChange={this.handleChange.bind(this)} required={this.props.required}/> {/*<HelpBlock>Validation is based on string length.</HelpBlock> */}
            </FormGroup>
        );
    }
}

NTextField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default NTextField;
