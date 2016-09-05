import React, {Component, PropTypes} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Radio} from 'react-bootstrap';

import NConstraint from '../constraints/NConstraint';

class NRadio extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            dataList: []
        };
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        let _this = this;

        if (this.props.code_grp_id) {
            // 콤보박스 Data 요청
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + '/itg/base/searchCodeDataList.do',
                contentType: "application/json",
                dataType: "json",
                async: true,
                data: JSON.stringify(this.props),
                success: function(data) {
                    if (data.success) {
                        _this.setState({dataList: data.gridVO.rows});
                    } else {
                        showMessage(data.resultMsg);
                    }
                }
            });
        }
    }

    render() {
        let dataList = this.state.dataList;
        let renderRadio = (dataList.map((data) => {
            if (NConstraint.PRODUCT === "ITSM") {
                return (
                    <Radio name={this.props.id} key={data.CODE_ID} value={data.CODE_ID}>{data.CODE_TEXT}</Radio>
                );
            } else {
                //return (<option key={option[NConstraint.DEFAULT_OPTION_VALUE]} value={option[NConstraint.DEFAULT_OPTION_VALUE]}>{option[NConstraint.DEFAULT_OPTION_NAME]}</option>);
            }
        }));

        return (
            <FormGroup controlId={this.props.id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                {renderRadio}
            </FormGroup>
        );
    }
}

NRadio.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string
};

export default NRadio;
