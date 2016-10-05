import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class LayoutBExample extends Component {
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
        NControlUtils.bindButtonEvent(this, this.props.form.topButtons);
        NControlUtils.bindButtonEvent(this, this.props.form.buttomButtons);
    }

    handleNewBtn() {
        alert("신규등록");

        // 또는 Ref로 접근하여 처리해도 될 듯 합니다.
        //NControlUtils.bindButtonEvent(this, this.props.form.topButtons);
        //NControlUtils.bindButtonEvent(this, this.props.form.buttomButtons);

        this.updateLayout();
    }

    handleHideBtn() {
        NControlUtils.setVisible(this.props.form.fieldSet[0].fieldList, ["user_nm", "position"], false);

        this.updateLayout();
    }

    handleShowBtn() {
        NControlUtils.setVisible(this.props.form.fieldSet[0].fieldList, ["user_nm", "position"], true);

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

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
    }

    render() {
        return (
            <div>
                <NLayoutSet layout={this.props.layout} first={this.props.grid} second={this.props.form}/>
            </div>
        );
    }
}

LayoutBExample.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    form: PropTypes.object
};

LayoutBExample.defaultProps = {
    layout: {
        type: "B"
    },
    grid: {
        type: "grid",
        id: "deptGrid",
        title: "부서목록",
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
            up_cust_id: "1000000"
        }
    },
    form: {
        type: "form",
        id: "theForm",
        title: "Form Title",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        topButtons: [
            {
                id: "new_btn",
                label: "신규등록",
                onClickEvent: "handleNewBtn"
            }, {
                id: "excel_btn",
                label: "엑셀다운로드",
                onClickEvent: "handleExcelBtn"
            }, {
                id: "hide_btn",
                label: "필드숨김",
                onClickEvent: "handleHideBtn"
            }, {
                id: "show_btn",
                label: "필드보기",
                onClickEvent: "handleShowBtn"
            }
        ],
        buttomButtons: [
            {
                id: "save_btn",
                label: "저장",
                onClickEvent: "handleSaveBtn"
            }, {
                id: "cancel_btn",
                label: "취소",
                onClickEvent: "handleCancelBtn"
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
                        label: NConstraint.MESSAGE('res.label.system.00015'),
                        placeholder: "사용자명을 입력해주세요."
                    }, {
                        type: "text",
                        id: "position",
                        label: NConstraint.MESSAGE('res.label.system.00016'),
                        placeholder: "직위를 입력해주세요."
                    }, {
                        type: "text",
                        id: "pass_wd",
                        label: "패스워드1",
                        placeholder: "패스워드를 입력해주세요.",
                        value: "패스워드",
                        visible: false
                    }, {
                        type: "addonicontextfield",
                        id: "addon1",
                        label: "아이콘텍스트",
                        placeholder: "아이콘텍스트",
                        value: "아이콘",
                        readonly: true
                    }, {
                        type: "date",
                        id: "date1",
                        label: "날짜"
                    }, {
                        type: "date",
                        id: "date2",
                        label: "날짜+시간",
                        timePicker: true
                    }, {
                        type: "number",
                        id: "number1",
                        label: "숫자필드"
                    }, {
                        type: "autocompletefield",
                        id: "search_user_nm",
                        label: "자동완성(AutoComplete)",
                        placeholder: "요청명을 입력해주세요.",
                        url: "/itg/base/searchCodeDataList.do",
                        data: {
                            code_grp_id: "REQ_TYPE"
                        },
                        parameterMapField: {
                            searchField: "search_code_text", filtersToJson: true
                        },
                        template: '<span class="order-id">[#= CODE_ID #]</span> #= CODE_TEXT #',
                        dataTextField: 'CODE_TEXT',
                        help: 'ex) 장애'
                    }, {
                        type: "multiselectbox",
                        id: "multi_user_nm",
                        label: "멀티선택(콤보)-정적item",
                        placeholder: "컬러를 선택해주세요",
                        items: [
                            { text: 'Black', value: '1' },
                            { text: 'Orange', value: '2' },
                            { text: 'Grey', value: '3' }
                        ],
                        dataTextField: "text",
                        dataValueField: "value",
                    }, {
                        type: "multiselectbox",
                        id: "multi_req_type",
                        label: "멀티선택(콤보) - 공통코드(다중선택)",
                        placeholder: "요청유형을 선택해주세요.",
                        url: "/itg/base/searchCodeDataList.do",
                        data: {
                           code_grp_id: "REQ_TYPE"
                       },
                       dataTextField: "CODE_TEXT",
                       dataValueField: "CODE_ID",
                       multiple: true
                    }, {
                        type: "multiselectbox",
                        id: "multi_user_ids",
                        label: "멀티선택(콤보) - 검색(하나만 선택)",
                        placeholder: "사용자명을 입력해주세요.",
                        url: "/itg/system/user/searchUserList.do",
                        dataTextField: "USER_NM",
                        dataValueField: "USER_ID",
                        serverFiltering: true,
                        serverPaging: true,
                        minLength: 2,
                        maxSelectedItems: 1,
                        itemTemplate: '<span class="order-id">#= USER_ID # -</span> #= USER_NM #',
                        help: '2자 이상 입력, ex) te'
                    }, {
                        type: "multiselectbox",
                        id: "multi_user_ids2",
                        label: "멀티선택(콤보) - 검색(멀티)",
                        placeholder: "사용자명을 입력해주세요.",
                        url: "/itg/system/user/searchUserList.do",
                        dataTextField: "USER_NM",
                        dataValueField: "USER_ID",
                        serverFiltering: true,
                        serverPaging: true,
                        minLength: 1,
                        multiple: true,
                        itemTemplate: '<span class="order-id">[#= USER_ID #] -</span> #= USER_NM #',
                        help: '1자 이상 입력, ex) 김'
                    }, {
                        type: "static",
                        id: "pass_wd1",
                        label: "패스워드 힌트(스태틱 Text)",
                        value: "패스워드 힌트는 nkia",
                        visible: false
                    }, {
                        type: "checkbox",
                        id: "checkbox1",
                        label: "체크박스(서버사이드)",
                        code_grp_id: "REQ_TYPE"
                    }, {
                        type: "radio",
                        id: "radio1",
                        label: "라디오버튼(서버사이드)",
                        code_grp_id: "REQ_TYPE"
                    }, {
                        type: "combo",
                        id: "combo1",
                        label: "콤보박스(사용자 정의 데이터)",
                        placeholder: "콤보박스",
                        options: [
                            {
                                CODE_TEXT: "1",
                                CODE_ID: "1"
                            }, {
                                CODE_TEXT: "2",
                                CODE_ID: "2"
                            }
                        ]
                    }, {
                        type: "combo",
                        id: "combo2",
                        label: "콤보박스(서버사이드)",
                        placeholder: "콤보박스",
                        code_grp_id: "REQ_TYPE"
                    }, {
                        type: "textarea",
                        id: "address",
                        label: "집주소",
                        placeholder: "집주소를 입력해주세요."
                    }
                ]
            }
        ]
    }
};

export default LayoutBExample;
