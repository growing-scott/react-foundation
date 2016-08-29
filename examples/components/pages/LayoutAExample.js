import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

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
    console.info(this);
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
          { type: "text", id: "user_nm", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
          { type: "text", id: "position", label: "직위", placeholder: "직위를 입력해주세요."},
          { type: "text", id: "pass_wd", label: "패스워드1", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd1", label: "패스워드2", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd2", label: "패스워드3", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "textarea", id: "address", label: "집주소", placeholder: "집주소를 입력해주세요."}
        ]
      }
    ]
  }
}

export default LayoutAExample;
