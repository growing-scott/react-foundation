import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonToolbar, Button} from 'react-bootstrap';

import NFieldSet from './NFieldSet';

class NForm extends Component{
  constructor() {
    super(...arguments);
  }

  // Compoent Render 이전 이벤트
  componentWillMount() {

  }

  // Compoent Render 이후 이벤트
  componentDidMount() {

  }

  render(){
    let fieldSets = this.props.fieldSets;

    // Top Button 생성
    let topComponent;
    if(this.props.topButtons){
      let topButtons = this.props.topButtons;
      topComponent = (topButtons.map(
        (button) => {
          if(button.visible)
            return <Button key={button.id} onClick={button.onClick}>{button.label}</Button>;
        }
      ));
      /*
      topComponent = (topButtons.map(
        (button) => <Button key={button.id} onClick={button.onClick}>{button.label}</Button>
      ))
      */
    }

    // Bottom Button 생성
    let bottomComponent;
    if(this.props.buttomButtons){
      let buttomButtons = this.props.buttomButtons;
      bottomComponent = (buttomButtons.map(
        (button) => {
          if(button.visible)
            return <Button key={button.id} onClick={button.onClick}>{button.label}</Button>;
        }
      ));
    }

    return(
      <Form>
        {topComponent}
        {fieldSets.map(
  				(fieldSet) => <NFieldSet key={fieldSet.id} fieldList={fieldSet.fieldList} />
  			)}
        {bottomComponent}
      </Form>
    );
  }
}

NForm.propTypes = {

};

export default NForm;
