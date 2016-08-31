import React, {Component, PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import NStaticText from './NStaticText';
import NTextField from './NTextField';
import NTextArea from './NTextArea';
import NComboBox from './NComboBox';
import NCheckBox from './NCheckBox';
import NRadio from './NRadio';
import NAddOnIconTextField from './NAddOnIconTextField';

class NFieldSet extends Component{
  constructor() {
    super(...arguments);
		this.state = {
			fieldList: []
    };
  }

  // Compoent Render 이전 이벤트
  componentWillMount() {
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
          component = (<NTextField key={field.id} id={field.id} label={field.label} placeholder={field.placeholder} value={field.value} visible={( "visible" in field ) ? field.visible : true} />);
          break;
        case "textarea":
          component = (<NTextArea key={field.id} id={field.id} label={field.label} placeholder={field.placeholder} value={field.value} />);
          break;
        case "combo":
            component = (<NComboBox key={field.id} id={field.id} label={field.label} placeholder={field.placeholder} value={field.value} code_grp_id={field.code_grp_id} options={field.options} />);
            break;
        case "checkbox":
            component = (<NCheckBox key={field.id} id={field.id} label={field.label} code_grp_id={field.code_grp_id} />);
            break;
        case "radio":
            component = (<NRadio key={field.id} id={field.id} label={field.label} code_grp_id={field.code_grp_id} />);
            break;
        case "static":
            component = (<NStaticText key={field.id} id={field.id} label={field.label} value={field.value} />);
            break;
        case "addonicontextfield":
            component = (<NAddOnIconTextField key={field.id} id={field.id} label={field.label} placeholder={field.placeholder} value={field.value} />);
            break;
        default:
      }
      return component;
    }));

    return(
      <div>
        {renderFields}
      </div>
    );
  }
}

NFieldSet.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

export default NFieldSet;
