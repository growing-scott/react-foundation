import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class LayoutCExample extends Component {
    constructor() {
        super(...arguments);
        //this.handleNewBtn = this.handleNewBtn.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        this.eventHandler();
    }

    // Event Handler Mapping
    eventHandler() {
        NControlUtils.bindEvent(this, this.props.tree, this.props.tree.onSelectEvent, "onSelect");
    }

    onSelectTree() {
        alert("Tree 선택");
    }

    handleNewBtn() {
        console.info(this);
        alert("신규등록2");
    }

    handleExcelBtn() {
        console.info(this);
        alert("엑셀다운로드2");
    }

    render() {
        console.info(this);
        return (
            <div>
                <NLayoutSet layout={this.props.layout} first={this.props.grid} second={this.props.form} />
            </div>
        );
    }
}

LayoutCExample.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    form: PropTypes.object
};

LayoutCExample.defaultProps = {
    layout: {
        type: "C"
    },
    tree: {
        type: "tree",
        url: "/itg/system/dept/searchStaticAllDeptTree.do",
        params: {
            is_all_tree: "Y",
            expandLevel: 2,
            up_node_id: "root"
        },
        onSelectEvent: "onSelectTree"
    },
    grid: {
        type: "grid",
        url: "/itg/system/dept/searchDeptOrderList.do",
        // Resource 또는 Columns 정의
        // Resource 로 설정한 경우에는 서버사이드로 요청해서 Resource를 받아온다.
        // Columns로 정의된 경우에는 Column 정보를 직접 기술한다.
        columns: [
            {
                field: 'CUST_NM',
                title: '부서명',
                width: 120
            }, {
                field: 'USE_YN',
                title: '사용여부',
                width: 160
            }, {
                field: 'CUST_ID',
                width: 240,
                title: '부서ID'
            }
        ],
        paging: true,
        params: {
            start: 1,
            page: 1,
            limit: 20,
            up_cust_id: "1000000"
        }
    },
    form: {
        type: "form",
        name: "theForm",
        title: "Form Title",
        action: "/theForm.do",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        method: "post", // Default Post
        position: "inline", // Inline 또는 Modal
        buttomButtons: [
            {
                id: "new_btn",
                label: "신규등록",
                onClick: ""
            }, {
                id: "excel_btn",
                label: "엑셀다운로드",
                onClick: ""
            }
        ],
        fieldSet: [
            {
                id: "editor_fields",
                columns: 3,
                fieldList: [
                    {
                        type: "text",
                        id: "user_nm",
                        label: "사용자명",
                        placeholder: "사용자명을 입력해주세요."
                    }, {
                        type: "text",
                        id: "position",
                        label: "직위",
                        placeholder: "직위를 입력해주세요."
                    }, {
                        type: "text",
                        id: "pass_wd",
                        label: "패스워드",
                        placeholder: "패스워드를 입력해주세요.",
                        value: "패스워드"
                    }, {
                        type: "text",
                        id: "pass_wd1",
                        label: "핫모듈",
                        placeholder: "패스워드를 입력해주세요.",
                        value: "패스워드"
                    }, {
                        type: "text",
                        id: "pass_wd2",
                        label: "패스워드",
                        placeholder: "패스워드를 입력해주세요.",
                        value: "패스워드"
                    }
                ]
            }
        ]
    }
};

export default LayoutCExample;
