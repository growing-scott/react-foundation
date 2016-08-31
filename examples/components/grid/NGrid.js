import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';

class NGrid extends Component{
  constructor(){
    super(...arguments);
    this.state = {
			columns: []
    };
  }

  // Compoent Render 이전 이벤트
  componentWillMount() {
    // Columns 처리
    if(this.props.grid.columns){
      this.setState({ columns: this.props.grid.columns });
    }
    // Resource 처리
    if(this.props.grid.resource){
      console.info("resource");
      let _this = this;
      $.ajax({ type:"POST",
        url: NConstraint.SERVER + "/itg/base/getGridMsgSource.do",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data : JSON.stringify({resource_prefix : this.props.grid.resource}),
        success:function(data){
  				if(data.gridText !== null) {
  					let gridText = data.gridText.split(",");
  					let gridHeader = data.gridHeader.split(",");
  					let gridWidth = data.gridWidth.split(",");
  					let gridAlign = data.gridAlign.split(",");

            let i, len;
            let columns = [];
            for(i = 0, len=gridText.length; i < len; i++){
              let column = {
                field: gridHeader[i],
                title: gridText[i],
                width: gridWidth[i]
              };
              columns.push(column);
            }
            _this.setState({ columns: columns });
  				}
  			}
  		});
    }
  }

  render() {
    return (
      <Puf.Grid url={this.props.grid.url} method="POST" columns={this.state.columns} onSelectRow={this.props.grid.onSelectRow}
        params={this.props.grid.params} pageable={this.props.grid.paging} filterable={true} listField={null} />
    );
  }
}
export default NGrid;
