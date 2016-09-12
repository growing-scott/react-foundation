import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

import AutoComplete from '../kendo/AutoComplete';
import MultiSelect from '../kendo/MultiSelect';

class LayoutAExample extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            updateLayout: false
        };
        //this.handleNewBtn = handleNewBtn.bind(this)
        this.updateLayout = this.updateLayout.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        this.eventHandler();
    }

    // Event Handler Mapping
    eventHandler() {
        // 버튼 Event bind
        //NControlUtils.bindButtonEvent(this, this.props.form.topButtons);
        //NControlUtils.bindButtonEvent(this, this.props.form.buttomButtons);

        // Grid Event bind
        NControlUtils.bindEvent(this, this.props.grid, this.props.grid.onSelectRowEvent, "onSelectRow");
    }

    handleNewBtn() {
        alert("신규등록");

        // 또는 Ref로 접근하여 처리해도 될 듯 합니다.
        //NControlUtils.bindButtonEvent(this, this.props.form.topButtons);
        //NControlUtils.bindButtonEvent(this, this.props.form.buttomButtons);

        this.updateLayout();
    }

    handleHideBtn() {
        //NControlUtils.setVisible(this.props.form.fieldSet[0].fieldList, ["user_nm", "position"], false);

        this.updateLayout();
    }

    handleShowBtn() {
        //NControlUtils.setVisible(this.props.form.fieldSet[0].fieldList, ["user_nm", "position"], true);

        this.updateLayout();
    }

    handleExcelBtn() {
        alert("엑셀다운로드2");
    }

    handleSaveBtn() {
        alert("저장");
    }

    handleCancelBtn() {
        alert("취소");
    }

    onSelectRowGrid(dataSet) {
        alert(JSON.stringify(dataSet.data));
    }

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
    }

    render() {


        //let filterFields = ["USER_ID", "USER_NM"];

        return (
            <div>
                <NLayoutSet ref="test2" layout={this.props.layout} first={this.props.grid} second={this.props.form}/>
            </div>
        );
    }
}

LayoutAExample.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    form: PropTypes.object
};

LayoutAExample.defaultProps = {
    layout: {
        type: "A"
    },
    grid: {
        type: "grid",
        id: "deptGrid",
        title: "부서목록",
        url: "/itg/system/dept/searchDeptOrderList.do",
        // Resource 또는 Columns 정의
        // Resource 로 설정한 경우에는 서버사이드로 요청해서 Resource를 받아온다.
        resource: "grid.system.dept",
        // Columns로 정의된 경우에는 Column 정보를 직접 기술한다.
        paging: true,
        params: {
            up_cust_id: "1000000"
        },
        onSelectRowEvent: "onSelectRowGrid"
    }
};

export default LayoutAExample;
