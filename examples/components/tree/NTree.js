import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';

class NTree extends Component {
    constructor() {
        super(...arguments);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {}

    render() {
        return (<Puf.TreeView className="treeview-line" host={NConstraint.HOST} url={this.props.tree.url} method="POST" data={this.props.tree.params} onSelect={this.props.tree.onSelect} childrenField="children" />);
    }
}
export default NTree;
