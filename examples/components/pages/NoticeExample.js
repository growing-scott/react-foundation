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
        // 최초 초기화 처리
        this.initRender();
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    // Refs 정의
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

    // 렌더 초기화 핸들러
    initRender() {
        const {grid, form} = this.props;

        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, grid.topButtons);
        NControlUtils.bindButtonEvent(this, form.buttomButtons);

        // Grid Event bind
        NControlUtils.bindEvent(this, grid, grid.onSelectRowEvent, "onSelectRow");

        // visible 제어
        //NControlUtils.setVisible(form.buttomButtons, ["save_btn", "cancel_btn"], false);
    }

    // Grid 선택 이벤트
    onSelectRowGrid(dataSet) {
        const {grid, form} = this.props;

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
                //let form = _this.getRefs("form");
                _this.getRefs("form").setFormValuesByMap(data.resultMap);

                NControlUtils.setVisible(form.buttomButtons, ["save_btn", "delete_btn"], true);

                _this.updateLayout();
            }
        });
    }

    // 신규등록
    doNew() {
        const {grid, form} = this.props;

        NControlUtils.setVisible(grid.topButtons, ["new_btn"], false);
        NControlUtils.setVisible(form.buttomButtons, ["save_btn", "cancel_btn"], true);
        NControlUtils.setVisible(form.buttomButtons, ["delete_btn"], false);

        this.updateLayout();
    }

    // 엑셀다운로드
    doExcelDownload() {
        alert("엑셀다운로드 구현예정");
    }

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

    // 삭제
    doDelete() {
        let _this = this;
        let form = this.getRefs("form");

        if (form.getValidation().validate()) {
            let params = _this.getRefs("form").getFormValuesForMap();
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/system/board/deleteNoticeBoardInfo.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(params),
                success: function(data) {
                    alert("삭제되었습니다.");
                    _this.getRefs("grid").refresh();
                    _this.updateLayout();
                }
            });
        }
    }

    doCancel() {
        const {grid, form} = this.props;

        NControlUtils.setVisible(grid.topButtons, ["new_btn"], true);
        NControlUtils.setVisible(form.buttomButtons, ["save_btn", "delete_btn", "cancel_btn"], false);

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
        type: "C"
    },
    grid: {
        type: "grid",
        id: "theGrid",
        title: "공지사항 목록",
        url: "/itg/system/board/searchNoticeBoardList.do",
        resource: "grid.board.notice",
        paging: true,
        selectable: "row",
        onSelectRowEvent: "onSelectRowGrid",
        topButtons: [
            {
                id: "new_btn",
                type: "primary",
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
        title: "공지사항",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        buttomButtons: [
            {
                id: "save_btn",
                type: "primary",
                label: "저장",
                onClickEvent: "doSave",
                visible: false
            }, {
                id: "delete_btn",
                type: "info",
                label: "삭제",
                onClickEvent: "doDelete",
                visible: false
            }, {
                id: "cancel_btn",
                type: "info",
                label: "취소",
                onClickEvent: "doCancel",
                visible: false
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
