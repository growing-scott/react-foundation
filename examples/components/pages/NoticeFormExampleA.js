import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { hashHistory } from 'react-router';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class NoticeFormExampleA extends Component {
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
    componentDidMount() {
        console.info(this);

        const {state} = this.props.location;

        let _this = this;
        $.ajax({
            type: "POST",
            url: NConstraint.HOST + "/itg/system/board/selectNoticeBoardInfo.do",
            contentType: "application/json",
            dataType: "json",
            async: false,
            data: JSON.stringify({no_id: state.no_id, flag: true}),
            success: function(data) {
                // Form Data Set
                //let form = _this.getRefs("form");
                _this.getRefs("form").setFormValuesByMap(data.resultMap);
            }
        });
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

    // 렌더 초기화 핸들러
    initRender() {
        const {form} = this.props;

        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, form.buttomButtons);
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

    doCancel() {
        hashHistory.push({
            pathname: '/noticeA'
        });
    }

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
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

export default NoticeFormExampleA;
