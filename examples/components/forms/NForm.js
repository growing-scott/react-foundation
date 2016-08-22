import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import NFieldSet from './NFieldSet';

class NForm extends Component{
  constructor() {
    super(...arguments);
  }

  // Compoent Render 이전 이벤트
  componentDidMount() {

  }

  // Compoent Render 이후 이벤트
  componentDidMount() {

  }

  render(){
    let fieldSets = this.props.fieldSets;

    return(
      <Form>
        {fieldSets.map(
  				(fieldSet) => <NFieldSet key={fieldSet.id} fieldList={fieldSet.fieldList} />
  			)}
      </Form>
    )
  }
}

NForm.propTypes = {

}

export default NForm;
