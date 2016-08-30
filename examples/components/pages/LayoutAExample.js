import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControls from '../utils/NControls';

class LayoutAExample extends Component{
  constructor(){
    super(...arguments);
    this.state = {
			updateLayout: false
    }
    //this.handleNewBtn = handleNewBtn.bind(this)

  }

  // Compoent Render 이전 이벤트
  componentWillMount() {
    this.eventHandler();
  }

  // Event Handler Mapping
  eventHandler(){
    // 버튼 Convert
    NControls.convertButton(this, this.props.form.topButtons, null);
    NControls.convertButton(this, this.props.form.buttomButtons, ["save_btn", "cancel_btn"]);
  }

  handleNewBtn(){
    alert("신규등록");

    // 또는 Ref로 접근하여 처리해도 될 듯 합니다.
    NControls.convertButton(this, this.props.form.topButtons, ["new_btn"]);
    NControls.convertButton(this, this.props.form.buttomButtons, null);
    this.setState({ updateLayout: true });
  }

  handleExcelBtn(){
    alert("엑셀다운로드2");
  }

  handleSaveBtn(){
    alert("저장");
  }

  handleCancelBtn(){
    alert("취소");
  }

  render(){
    console.info(this);
    return (
      <div>
        <NLayoutSet layout={this.props.layout} first={this.props.grid} second={this.props.form} />
      </div>
    )
  }
}

LayoutAExample.propTypes = {
  layout: PropTypes.object,
  grid: PropTypes.object,
  form: PropTypes.object
}

LayoutAExample.defaultProps = {
  layout: {
    type: "A"
  },
  grid: {
    type: "grid",
    url: "/searchGo.do",
    resource: "i18n",
    paging: false
  },
  form: {
    type: "form",
    name: "theForm",
    title: "Form Title",
    action: "/theForm.do",
    formType: "editor",   // 입력 또는 Search Form 또는 Readonly
    method: "post",   // Default Post
    position: "inline",   // Inline 또는 Modal
    topButtons: [
      {
        id: "new_btn",
        label: "신규등록",
        onClickEvent: "handleNewBtn"
      },
      {
        id: "excel_btn",
        label: "엑셀다운로드",
        onClickEvent: "handleExcelBtn"
      }
    ],
    buttomButtons: [
      {
        id: "save_btn",
        label: "저장",
        onClickEvent: "handleSaveBtn"
      },
      {
        id: "cancel_btn",
        label: "취소",
        onClickEvent: "handleCancelBtn"
      }
    ],
    fieldSet : [
      {
        id: "editor_fields",
        columns: 3,
        fieldList: [
          { type: "text", id: "user_nm", label: NConstraint.MESSAGE('res.label.system.00015'), placeholder: "사용자명을 입력해주세요."},
          { type: "text", id: "position", label: NConstraint.MESSAGE('res.label.system.00016'), placeholder: "직위를 입력해주세요."},
          { type: "text", id: "pass_wd", label: "패스워드1", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "static", id: "pass_wd1", label: "패스워드 힌트(스태틱 Text)", value: "패스워드 힌트는 nkia"},
          { type: "checkbox", id: "checkbox1", label: "체크박스(서버사이드)", code_grp_id: "REQ_TYPE"},
          { type: "radio", id: "radio1", label: "라디오버튼(서버사이드)", code_grp_id: "REQ_TYPE"},
          { type: "combo", id: "combo1", label: "콤보박스(사용자 정의 데이터)", placeholder: "콤보박스", options:[{ CODE_TEXT: "1", CODE_ID: "1"},{ CODE_TEXT: "2", CODE_ID: "2"}]},
          { type: "combo", id: "combo2", label: "콤보박스(서버사이드)", placeholder: "콤보박스", code_grp_id: "REQ_TYPE"},
          { type: "textarea", id: "address", label: "집주소", placeholder: "집주소를 입력해주세요."}
        ]
      }
    ]
  }
}

export default LayoutAExample;
