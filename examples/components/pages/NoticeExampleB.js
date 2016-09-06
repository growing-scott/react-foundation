import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { hashHistory } from 'react-router';

import NLayoutSet from '../layout/NLayoutSet';
import NModal from '../layout/NModal';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

import NLayoutUtils from '../utils/NLayoutUtils';

class NoticeExampleB extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            updateLayout: false
        };
        this.getRefs = this.getRefs.bind(this);
        this.updateLayout = this.updateLayout.bind(this);

        this.action = null;
    }

    // Refs 정의
    getRefs(type) {
        let ref;
        switch (type) {
            case "grid":
                ref = this.refs.n.refs.notice.refs.theGrid;
                break;
            case "form":
                ref = this.refs.m.refs.modal.refs.theForm;
                break;
            case "modal":
                ref = this.refs.m;
                break;
            default:
        }
        return ref;
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        // 최초 초기화 처리
        this.initRender();
    }

    // 렌더 초기화 핸들러
    initRender() {
        const {grid, form} = this.props;

        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, grid.topButtons);

        // Grid Event bind
        NControlUtils.bindEvent(this, grid, grid.onSelectRowEvent, "onSelectRow");

        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, form.buttomButtons);

        // visible 제어
        //NControlUtils.setVisible(form.buttomButtons, ["save_btn", "cancel_btn"], false);

        console.info(this);
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if(this.context.notification === null || this.context.notification == 'null'){
            this.context.notification = NLayoutUtils.Notification("notification");
        }
    }

    // Grid 선택 이벤트
    onSelectRowGrid(dataSet) {
        let params = { no_id: dataSet.data.NO_ID, flag: false };

        let modal = this.getRefs("modal");
        modal.open();

        this.action = "update";

        // query에 데이터가 있는 경우 서버로 부터 데이터를 가져온다.
        let _this = this;
        $.ajax({
            type: "POST",
            url: NConstraint.HOST + "/itg/system/board/selectNoticeBoardInfo.do",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify(params),
            success: function(data) {
                // Form Data Set
                //let form = _this.getRefs("form");
                _this.getRefs("form").setFormValuesByMap(data.resultMap);
            }
        });
    }

    // 신규등록
    doNew() {
        let modal = this.getRefs("modal");
        modal.open();

        this.action = "insert";
    }

    // 엑셀다운로드
    doExcelDownload() {
        let modal = this.getRefs("modal");
        modal.open();
        console.info(this);
        /*
        this.context.notification.show({
            title: "준비중",
            message: "엑셀다운로드는 구현 예정에 있습니다. 잠시만 기다려주세요."
        }, "error");
        */
    }

    // 저장
    doSave() {
        let _this = this;
        let form = this.getRefs("form");

        if (form.getValidation().validate()) {
            if(!confirm('저장하시겠습니까?')){
                return false;
            }
            let params = _this.getRefs("form").getFormValuesForMap();

            let url, resultMessage;
            if(this.action == "update"){
                url = "/itg/system/board/updateNoticeBoardInfo.do";
                resultMessage = "공지사항 [" + params.title + "]  수정되었습니다.";
            }else{
                url = "/itg/system/board/insertNoticeBoardInfo.do";
                resultMessage = "공지사항 [" + params.title + "]  등록되었습니다.";
            }

            $.ajax({
                type: "POST",
                url: NConstraint.HOST + url,
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(params),
                success: function(data) {
                    _this.context.notification.show({
                        message: resultMessage
                    }, "upload-success");

                    _this.getRefs("modal").close();
                    _this.getRefs("grid").refresh();
                }
            });
        }
    }

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
    }

    render() {
        return (
            <div>
                <NLayoutSet ref="n" layout={this.props.layout} first={this.props.grid} />
                <NModal ref="m" layout={this.props.modal} first={this.props.form} />
            </div>
        );
    }
}

NoticeExampleB.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    modal: PropTypes.object,
    form: PropTypes.object
};

NoticeExampleB.contextTypes = {
    notification: React.PropTypes.object
};

NoticeExampleB.defaultProps = {
    layout: {
        id: "notice",
        type: "A"
    },
    modal: {
        id: "modal",
        type: "A",
        title: "공지사항"
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
        modal: true,
        buttomButtons: [
            {
                id: "save_btn",
                label: "저장",
                onClickEvent: "doSave"
            }
        ],
        fieldSet: [
            {
                id: "editor_fields",
                columns: 3,
                fieldList: [
                    {
                        type: "hidden",
                        id: "no_id"
                    },
                    /*
                    {
                        type: "static",
                        id: "no_id",
                        label: "번호"
                    },
                    */{
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

export default NoticeExampleB;
