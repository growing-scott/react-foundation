import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

class NHiddenField extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: ""
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

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if (this.props.value) {
            this.setState({value: this.props.value});
        }
    }

    render() {
        return (
            <FormGroup ref={this.props.id} controlId={this.props.id}>
                <FormControl type="hidden" name={this.props.id} value={this.state.value} />
            </FormGroup>
        );
    }
}

NHiddenField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default NHiddenField;
