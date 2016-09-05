import React, {Component, PropTypes} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox} from 'react-bootstrap';

import NConstraint from '../constraints/NConstraint';

class NCheckBox extends Component {
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
            // 공통코드 Data 요청
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
        let text = NConstraint.DEFAULT_OPTION_NAME;
        let value = NConstraint.DEFAULT_OPTION_VALUE;

        let dataList = this.state.dataList;
        let renderCheckBox = (dataList.map((data) => {
            return (
                <Checkbox name={this.props.id} key={data[value]} value={data[value]}>{data[text]}</Checkbox>
            );
        }));

        return (
            <FormGroup controlId={this.props.id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                {renderCheckBox}
            </FormGroup>
        );
    }
}

NCheckBox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string
};

export default NCheckBox;
