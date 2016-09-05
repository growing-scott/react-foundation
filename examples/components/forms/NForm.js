import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonToolbar, Button} from 'react-bootstrap';

import NFieldSet from './NFieldSet';

class NForm extends Component {

    constructor() {
        super(...arguments);
        this.getForm = this.getForm.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.getFormValuesForMap = this.getFormValuesForMap.bind(this);
        this.setFormValuesByMap = this.setFormValuesByMap.bind(this);
        this.setValidation = this.setValidation.bind(this);

        // Form 변수 선언
        this.validate = null;
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {}

    // Compoent Render 이후 이벤트
    componentDidMount() {
        // Validation 설정
        this.setValidation();
    }

    getForm() {
        return $(ReactDom.findDOMNode(this.refs[this.props.id]));
    }

    clearForm() {
        ReactDom.findDOMNode(this.refs[this.props.id]).reset();
    }

    getFormValuesForMap() {
        var data = {};
        this.getForm().serializeArray().map(function(field) {
            data[field.name] = field.value;
        });
        return data;
    }

    // Map에 의한 Form Value 셋팅
    setFormValuesByMap(data) {
        this.clearForm();

        let _this = this;
        this.props.fieldSets.map((fieldSet) => {
            let fields = _this.refs[fieldSet.id].refs;
            for (let fieldName in fields) {
                let field = _this.refs[fieldSet.id].refs[fieldName];
                if (data[field.props.id.toUpperCase()]) {
                    field.setValue(data[field.props.id.toUpperCase()]);
                }
            }
        });
    }

    // Validation 설정
    setValidation() {
        this.validate = this.getForm().kendoValidator({
            messages: {
                required: '필수항목 입니다.'
            }
        }).data("kendoValidator");
    }

    // Validation Return
    getValidation() {
        return this.validate;
    }

    render() {
        let fieldSets = this.props.fieldSets;

        return (
            <Form ref={this.props.id} id={this.props.id} name={this.props.id}>
                {fieldSets.map((fieldSet) => <NFieldSet ref={fieldSet.id} key={fieldSet.id} fieldList={fieldSet.fieldList}/>)}
            </Form>
        );
    }
}

NForm.propTypes = {
    id: PropTypes.string,
    validate: PropTypes.func
};

export default NForm;
