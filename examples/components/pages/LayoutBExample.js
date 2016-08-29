import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

class LayoutBExample extends Component{
  constructor(){
    super(...arguments);
    //this.handleNewBtn = this.handleNewBtn.bind(this);
  }

  handleNewBtn(){
    console.info(this);
    alert("신규등록2")
  }

  handleExcelBtn(){
    console.info(this);
    alert("엑셀다운로드2")
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

LayoutBExample.propTypes = {
  layout: PropTypes.object,
  grid: PropTypes.object,
  form: PropTypes.object
}

LayoutBExample.defaultProps = {
  layout: {
    type: "B"
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
    buttomButtons: [
      {
        id: "new_btn",
        label: "신규등록",
        onClick: LayoutBExample.prototype.handleNewBtn.bind(LayoutBExample.prototype)
      },
      {
        id: "excel_btn",
        label: "엑셀다운로드",
        onClick: LayoutBExample.prototype.handleExcelBtn.bind(this)
      }
    ],
    fieldSet : [
      {
        id: "editor_fields",
        columns: 3,
        fieldList: [
          { type: "text", id: "user_nm", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
          { type: "text", id: "position", label: "직위", placeholder: "직위를 입력해주세요."},
          { type: "text", id: "pass_wd", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd1", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd2", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"}
        ]
      }
    ]
  }
}

export default LayoutBExample;
