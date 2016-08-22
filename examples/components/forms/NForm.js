import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import FieldSet from './FieldSet';

class NForm extends Component{
  constructor() {
    super(...arguments);
		this.state = {
			fieldList: []
    }
  }

  // Compoent Render 이전 이벤트
  componentDidMount() {
    if(this.props.fieldSet){
      this.setState({ fieldList: this.props.fieldSet });
    }
  }

  // Compoent Render 이후 이벤트
  componentDidMount() {

  }

  render(){
    let fieldSetList = this.props.fieldSet;
    let renderFields = (fieldSet.map((field) => {
      let component;
      switch (field.type) {
        case "text":
          component = (<TextField key={field.id} id={field.id} label={field.label} placeholder={field.placeholder} value={field.value} />);
          break;
        case "textarea":
          component = (<TextArea key={field.id} id={field.id} label={field.label} placeholder={field.placeholder} value={field.value} />);
          break;
        default:
      }
      return component;
    }));

    return(
      <Form>
        {renderFields}
      </Form>
    )
  }
}

NForm.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string
}

export default NForm;
