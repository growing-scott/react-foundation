import React, {Component, PropTypes} from 'react';

import NLayoutA from './NLayoutA';
import NLayoutB from './NLayoutB';
import NLayoutC from './NLayoutC';

class NLayoutSet extends Component{
  constructor() {
    super(...arguments);
  }

  render(){
    let layout = this.props.layout;
    let component;
    switch (layout.type) {
      case "A":
        component = (<NLayoutA firstArea={this.props.first} secondArea={this.props.second} />);
        break;
      case "B":
        component = (<NLayoutB firstArea={this.props.first} secondArea={this.props.second} />);
        break;
      case "C":
        component = (<NLayoutC firstArea={this.props.first} secondArea={this.props.second} thirdArea={this.props.third} />);
        break;
      default:
    }
    console.info(component);
    return(
      <div>
        {component}
      </div>

    )
  }
}

export default NLayoutSet;
