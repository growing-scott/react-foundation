import React, {Component, PropTypes} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox} from 'react-bootstrap';

class NStaticText extends Component{
  constructor() {
    super(...arguments);
		this.state = {
			dataList: []
    };
  }

  render(){
    return(
      <FormGroup controlId={this.props.id}>
        <ControlLabel>{this.props.label}</ControlLabel>
        <FormControl.Static>
          {this.props.value}
        </FormControl.Static>
      </FormGroup>
    );
  }
}

NStaticText.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string
};

export default NStaticText;
