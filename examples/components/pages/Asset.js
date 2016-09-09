import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

import NLayoutUtils from '../utils/NLayoutUtils';

class Asset extends Component {
    constructor() {
        super(...arguments);
        //this.handleNewBtn = this.handleNewBtn.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        // 최초 초기화 처리
        this.initRender();
    }

    // Event Handler Mapping
    initRender() {
        const {grid, tree} = this.props;

        NControlUtils.bindEvent(this, tree, tree.onSelectEvent, "onSelect");

        // Grid Event bind
        NControlUtils.bindEvent(this, grid, grid.onSelectRowEvent, "onSelectRow");
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if(this.context.notification === null || this.context.notification == 'null'){
            this.context.notification = NLayoutUtils.Notification("notification");
        }
    }

    onSelectTree() {
        this.context.notification.show({
            title: "준비중",
            message: "트리와 그리드 연동 구현 예정입니다."
        }, "error");
    }

    // Grid 선택 이벤트
    onSelectRowGrid(dataSet) {
        // 상위 이벤트로 전달(탭)
        this.props.onEvent(dataSet);
    }

    render() {
        return (
            <div>
                <NLayoutSet layout={this.props.layout} first={this.props.tree} second={this.props.form} third={this.props.grid}/>
            </div>
        );
    }
}

Asset.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    form: PropTypes.object
};

Asset.contextTypes = {
    notification: React.PropTypes.object
};

Asset.defaultProps = {
    layout: {
        type: "D"
    },
    tree: {
        id: "classTree",
        title: "분류체계",
        type: "tree",
        url: "/itg/itam/statistics/searchClassTree.do",
        params: {
            class_mng_type: "AM",
            expandLevel: 2,
            up_node_id: "root"
        },
        onSelectEvent: "onSelectTree"
    },
    grid: {
        type: "grid",
        id: "theGrid",
        title: "자산목록",
        url: "/itg/itam/statistics/searchAssetList.do",
        resource: "grid.itam.statistics.AMROOT",
        //pageSize: 30,
        paging: true,
        scrollable: true,
        selectable: "row",
        params: {
            class_type: "ROOT",
            class_mng_type: "AM",
            asset_state : 'ACTIVE',
            class_id : '0'
        },
        onSelectRowEvent: "onSelectRowGrid"
    },
    form: {
        type: "form",
        id: "theForm",
        title: "검색 조건",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        fieldSet: [{
            id: "editor_fields",
            columns: 3,
            fieldList: [
                { type: "text", id: "asset_nm", label: "자산명"}
            ]
        }]
    }
};

export default Asset;
