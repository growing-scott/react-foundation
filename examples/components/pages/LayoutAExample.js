import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

class LayoutAExample extends Component{
  constructor(){
    super(...arguments);
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
    fieldSet : [
      {
        id: "editor_fields",
        columns: 3,
        fieldList: [
          { type: "text", id: "user_nm", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
          { type: "text", id: "position", label: "직위", placeholder: "직위를 입력해주세요."},
          { type: "text", id: "pass_wd", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd1", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd2", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd3", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd4", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd5", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd6", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd7", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd8", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd9", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd10", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd11", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd12", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd13", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd14", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd15", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd16", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd17", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "text", id: "pass_wd18", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
          { type: "textarea", id: "address", label: "집주소", placeholder: "집주소를 입력해주세요."}
        ]
      }
    ]
  }
}

export default LayoutAExample;
