import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';

class NTree extends Component{
  constructor(){
    super(...arguments);

  }

  // Compoent Render 이전 이벤트
  componentWillMount() {

  }

  render() {
    return (
      <Puf.TreeView className="treeview-line" url={this.props.tree.url} method="POST" params={this.props.tree.params} onSelect={this.props.onSelect} />
    );
  }
}
export default NTree;
