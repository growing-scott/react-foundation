import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { hashHistory } from 'react-router';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';

import NLayoutUtils from '../utils/NLayoutUtils';
import NControlUtils from '../utils/NControlUtils';

class NoticeFormExampleA extends Component {
    constructor() {
        super(...arguments);

        this.getRefs = this.getRefs.bind(this);
    }

    // Refs 정의
    getRefs(type) {
        let ref;
        switch (type) {
            case "form":
                ref = this.refs.n.refs.notice.refs.theForm;
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

    // 렌더 초기화(버튼 바인딩, 이벤트 바인딩 수행)
    initRender() {
        const {form} = this.props;

        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, form.buttomButtons);
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        // Notification 이 없을 경우 생성.
        if(this.context.notification === null || this.context.notification == 'null'){
            this.context.notification = NLayoutUtils.Notification("notification");
        }

        // query에 데이터가 있는 경우 서버로 부터 데이터를 가져온다.
        const {query} = this.props.location;
        if(Object.keys(query).length > 0){
            let _this = this;
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/system/board/selectNoticeBoardInfo.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(query),
                success: function(data) {
                    // Form Data Set
                    //let form = _this.getRefs("form");
                    _this.getRefs("form").setFormValuesByMap(data.resultMap);
                }
            });
        }
    }



    // 신규 등록 또는 수정
    doSave() {
        let _this = this;
        let form = this.getRefs("form");

        if (form.getValidation().validate()) {
            if(!confirm('저장하시겠습니까?')){
                return false;
            }
            const {query} = this.props.location;
            let params = _this.getRefs("form").getFormValuesForMap();

            let url, resultMessage;
            if(Object.keys(query).length > 0){
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
                    _this.goList();
                }
            });
        }
    }

    // 취소 이벤트(목록으로 돌아가기)
    doCancel() {
        this.goList();
    }

    // 목록으로 돌아가기
    goList(){
        hashHistory.push({
            pathname: '/noticeA'
        });
    }

    render() {
        return (
            <div>
                <NLayoutSet ref="n" layout={this.props.layout} first={this.props.form} />
            </div>
        );
    }
}

NoticeFormExampleA.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object,
    form: PropTypes.object
};

NoticeFormExampleA.contextTypes = {
    notification: React.PropTypes.object
};

NoticeFormExampleA.defaultProps = {
    layout: {
        id: "notice",
        type: "A"
    },
    form: {
        type: "form",
        id: "theForm",
        title: "Form Title",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        buttomButtons: [
            {
                id: "save_btn",
                type: "primary",
                label: "저장",
                onClickEvent: "doSave"
            },{
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

export default NoticeFormExampleA;
