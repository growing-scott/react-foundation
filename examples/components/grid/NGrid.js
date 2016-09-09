import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';

class NGrid extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            columns: [],
            refresh: false
        };
        this.refresh = this.refresh.bind(this);
    }

    // State, Props 변경에 따른 Rendering에 대한 제어. Grid Reload를 제어해야하는데
    // 버튼이랑 분리해서 필요할 듯 합니다.
    shouldComponentUpdate(nextProps, nextState) {
        //console.info(nextState);
        return nextState.refresh;
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        // Columns 처리
        if (this.props.grid.columns) {
            this.setState({columns: this.props.grid.columns});
        }
        // Resource 처리
        if (this.props.grid.resource) {
            let _this = this;
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/base/getGridMsgSource.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify({resource_prefix: this.props.grid.resource}),
                success: function(data) {
                    if (data.gridText !== null) {
                        let gridText = data.gridText.split(",");
                        let gridHeader = data.gridHeader.split(",");
                        let gridWidth = data.gridWidth.split(",");
                        let gridAlign = data.gridAlign.split(",");

                        let i = 0, len = gridText.length, columns = [];
                        for (i; i < len; i++) {
                            let column = {
                                field: gridHeader[i],
                                title: gridText[i],
                                width: gridWidth[i] + "px"
                            };
                            columns.push(column);
                        }
                        _this.setState({columns: columns});
                    }
                }
            });
        }
    }

    refresh() {
        this.setState({
            refresh: true
        });
    }

    render() {
        return (<Puf.Grid url={this.props.grid.url}
            method="POST"
            columns={this.state.columns}
            //{/* height={NConstraint.DEFAULT_GRID_HEIGHT}*/}
            onChange={this.props.grid.onSelectRow}
            host={NConstraint.HOST}
            data={this.props.grid.params}
            pageable={this.props.grid.paging}
            filterable={true}
            scrollable={this.props.grid.scrollable}
            listField={NConstraint.GRID_LIST_FIELD}
            totalField={NConstraint.GRID_TOTAL_FIELD}
            selectMode={this.props.grid.selectable}
            parameterMapField={NConstraint.GRID_PARAMTER_MAP_FIELD}/>);
    }
}

export default NGrid;
