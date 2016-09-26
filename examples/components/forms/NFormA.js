import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonToolbar, Button} from 'react-bootstrap';

import NFieldSet from './NFieldSet';

class NFormA extends Component {

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
        const fieldSets = this.props.fieldSets;

        let heaerTitles = ( "heaerTitles" in this.props ) ? this.props.heaerTitles : null;
        let rows = ( "rows" in this.props ) ? this.props.rows : 1;
        let columns = ( "columns" in this.props ) ? this.props.columns : 1;
        let sm = 12, lg = 12;

        if(columns > 1){
            sm = sm/columns;
            lg = lg/columns;
        }
        let colClassName = "col-sm-" + sm + " col-lg-" + lg;
        console.info(heaerTitles);
        console.info(columns);
        console.info(sm);
        console.info(lg);

        /*
        let fieldSetRender = function(filedSet, index, row, col){

        };
        */
        let render = [];
        for(let i = 0; i < rows; i++){
            let panelId = "panel_" + i;
            let hrefPanelId = "#" + panelId;
            let headerTitle = heaerTitles[i];

            let fieldSetRender = [];
            let colIdx = i * columns;
            let colLen = ((colIdx + columns) < fieldSets.length) ? (colIdx + columns) : fieldSets.length;
            console.info(colIdx, colIdx + columns);
            for(let j = colIdx, len = colLen; j < len; j++){
                let key = "filedSet_" + j;
                let fieldSet = fieldSets[j];
                fieldSetRender.push(
                    (<div key={key} className={colClassName}>
                        <h3><b>{fieldSet.title}</b></h3>
                        <NFieldSet ref={fieldSet.id} key={fieldSet.id} fieldList={fieldSet.fieldList}/>
                    </div>));
            }


            render.push((
                <div key={panelId} className="panel panel-default">
                    <div className="panel-heading">
                        <a data-toggle="collapse" href={hrefPanelId}>▶ {headerTitle}</a>
                    </div>
                    <div id={panelId} className="panel-body collapse in">
                        <div className="row">
                            {fieldSetRender}
                        </div>
                    </div>
                </div>
            ));
        }

        return (
			<form ref={this.props.id} id={this.props.id} name={this.props.id} role="form">
                {render}
			</form>
        );
    }
}

NFormA.propTypes = {
    id: PropTypes.string,
    validate: PropTypes.func
};

export default NFormA;
