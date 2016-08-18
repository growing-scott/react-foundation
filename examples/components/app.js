import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import TextField from './forms/TextField';

class App extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      textfields: [
        { id: "user_nm", label: "사용자명", placeholder: "사용자명을 입력해주세요."},
        { id: "pass_wd", label: "패스워드", placeholder: "패스워드를 입력해주세요.", value: "패스워드"},
        { id: "address", label: "집주소", placeholder: "집주소를 입력해주세요."}
      ]
    }
  }

  render(){
    let textfields = this.state.textfields;

    return (
      <div>
        컴포넌트 예제
        {textfields.map(
  				(textfield) => <TextField key={textfield.id} id={textfield.id} label={textfield.label} placeholder={textfield.placeholder} value={textfield.value} />
  			)}
      </div>
    )
  }
}

ReactDom.render(<App/>, document.getElementById('app'));
