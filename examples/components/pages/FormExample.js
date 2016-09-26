import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class FormExample extends Component {
    constructor() {
        super(...arguments);
    }

    render() {
        return (
            <div>
                <NLayoutSet layout={this.props.layout} first={this.props.form} />
            </div>
        );
    }
}

FormExample.propTypes = {
    form: PropTypes.object
};

FormExample.defaultProps = {
    layout: {
        type: "E"
    },
    form: {
        type: "formA",
        id: "theForm",
        title: "Form Title",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        columns: 2,
        rows: 2,
        heaerTitles: ["기본정보", "일반정보"],
        fieldSet : [
            {
                title: "텍스트필드",
                fieldList: [
                    { type: "text", id: "user_nm", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
                    { type: "text", id: "position", label: "직위", placeholder: "직위를 입력해주세요."},
                    { type: "text", id: "pass_wd", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"}
                ]
            },
            {
                title: "콤보박스",
                fieldList: [
                    { type: "text", id: "user_nm1", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
                    { type: "text", id: "position1", label: "직위", placeholder: "직위를 입력해주세요."},
                    { type: "text", id: "pass_wd1", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"}
                ]
            },
            {
                title: "텍스트필드1",
                fieldList: [
                    { type: "text", id: "user_nm11", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
                    { type: "text", id: "position11", label: "직위", placeholder: "직위를 입력해주세요."},
                    { type: "text", id: "pass_wd11", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"}
                ]
            },
            {
                title: "콤보박스1",
                fieldList: [
                    { type: "text", id: "user_nm22", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
                    { type: "text", id: "position22", label: "직위", placeholder: "직위를 입력해주세요."},
                    { type: "text", id: "pass_wd22", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"}
                ]
            }
        ]
    }
};

export default FormExample;
