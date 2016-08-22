import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import TextField from './TextField';
import TextArea from './TextArea';

class FieldSet extends Component{
  constructor() {
    super(...arguments);
		this.state = {
			fieldList: []
    }
  }

  // Value값 변경에 따른 이벤트 처리
  handleChange(e) {
  	this.setState({ value: e.target.value });
  }

  // Compoent Render 이전 이벤트
  componentDidMount() {
    if(this.props.fieldList){
      this.setState({ fieldList: this.props.fieldList });
    }
  }

  // Compoent Render 이후 이벤트
  componentDidMount() {
  
  }

  render(){
    let fieldList = this.props.fieldList;
    let renderFields = (fieldList.map((field) => {
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

FieldSet.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string
}

export default FieldSet;
