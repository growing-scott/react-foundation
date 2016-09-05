import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class NoticeExample extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            updateLayout: false
        };
        this.getRefs = this.getRefs.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        this.eventHandler();
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    getRefs(type) {
        let ref;
        switch (type) {
            case "form":
                ref = this.refs.n.refs.notice.refs.theForm;
                break;
            case "grid":
                ref = this.refs.n.refs.notice.refs.theGrid;
                break;
            default:
        }
        return ref;
    }

    // Event Handler Mapping
    eventHandler() {
        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, this.props.grid.topButtons, null);
        NControlUtils.bindButtonEvent(this, this.props.form.buttomButtons, ["save_btn", "cancel_btn"]);

        // Grid Event bind
        NControlUtils.bindEvent(this, this.props.grid, this.props.grid.onSelectRowEvent, "onSelectRow");
    }

    // Grid 선택 이벤트
    onSelectRowGrid(dataSet) {
        let _this = this;
        $.ajax({
            type: "POST",
            url: NConstraint.HOST + "/itg/system/board/selectNoticeBoardInfo.do",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify({no_id: dataSet.data.NO_ID, flag: true}),
            success: function(data) {
                // Form Data Set
                let form = _this.getRefs("form");
                form.setFormValuesByMap(data.resultMap);

            }
        });
    }

    // 신규등록
    doNew() {
        NControlUtils.bindButtonEvent(this, this.props.grid.topButtons, ["new_btn"]);
        NControlUtils.bindButtonEvent(this, this.props.form.buttomButtons, null);

        this.updateLayout();
    }

    // 엑셀다운로드
    doExcelDownload() {}

    // 저장
    doSave() {
        let _this = this;
        let form = this.getRefs("form");

        if (form.getValidation().validate()) {
            let params = _this.getRefs("form").getFormValuesForMap();
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/system/board/insertNoticeBoardInfo.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(params),
                success: function(data) {
                    alert("저장되었습니다.");
                    _this.getRefs("grid").refresh();
                    _this.updateLayout();
                }
            });
        }
    }

    doCancel() {
        NControlUtils.bindButton(this, this.props.grid.topButtons, null);
        NControlUtils.bindButton(this, this.props.form.buttomButtons, ["save_btn", "cancel_btn"]);

        this.updateLayout();
    }

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
    }

    render() {
        return (
            <div>
                <NLayoutSet ref="n" layout={this.props.layout} first={this.props.grid} second={this.props.form}/>
            </div>
        );
    }
}

NoticeExample.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    form: PropTypes.object
};

NoticeExample.defaultProps = {
    layout: {
        id: "notice",
        type: "B"
    },
    grid: {
        type: "grid",
        id: "theGrid",
        title: "공지사항 목록",
        url: "/itg/system/board/searchNoticeBoardList.do",
        resource: "grid.board.notice",
        paging: true,
        selectable: "row",
        params: {
            start: 1,
            page: 1,
            limit: 20
        },
        onSelectRowEvent: "onSelectRowGrid",
        topButtons: [
            {
                id: "new_btn",
                label: "신규등록",
                onClickEvent: "doNew"
            }, {
                id: "excel_btn",
                label: "엑셀다운로드",
                onClickEvent: "doExcelDownload"
            }
        ]
    },
    form: {
        type: "form",
        id: "theForm",
        title: "Form Title",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        buttomButtons: [
            {
                id: "save_btn",
                label: "저장",
                onClickEvent: "doSave"
            }, {
                id: "cancel_btn",
                label: "취소",
                onClickEvent: "doCancel"
            }
        ],
        fieldSet: [
            {
                id: "editor_fields",
                columns: 3,
                fieldList: [
                    {
                        type: "static",
                        id: "no_id",
                        label: "번호"
                    }, {
                        type: "text",
                        id: "ins_user_nm",
                        label: "작성자",
                        required: true,
                        readonly: true
                    }, {
                        type: "text",
                        id: "title",
                        label: "제목",
                        placeholder: "제목을 입력해주세요.",
                        required: true
                    }, {
                        type: "textarea",
                        id: "content",
                        label: "내용",
                        placeholder: "내용을 작성해주세요.",
                        required: true
                    }
                ]
            }
        ]
    }
};

export default NoticeExample;
