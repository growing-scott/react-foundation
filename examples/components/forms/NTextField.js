import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

class NTextField extends Component{
  constructor() {
    super(...arguments);
		this.state = {
			value: ""
    }
  }

  // Value값 변경에 따른 이벤트 처리
  handleChange(e) {
  	this.setState({ value: e.target.value });
  }

  // Compoent Render 이후 이벤트
  componentDidMount() {
    if(this.props.value){
      this.setState({ value: this.props.value });
    }
  }

  render(){
    return(
      <FormGroup controlId={this.props.id}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl
          type="text"
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.handleChange.bind(this)}
        />
        <HelpBlock>Validation is based on string length.</HelpBlock>
      </FormGroup>
    )
  }
}

NTextField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string
}

export default NTextField;
