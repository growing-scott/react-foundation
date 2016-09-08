import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class AssetForm extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            updateLayout: false
        };
        //this.handleNewBtn = handleNewBtn.bind(this)
        this.updateLayout = this.updateLayout.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {

    }

    handleSaveBtn() {
        alert("저장");
    }

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
    }

    render() {
        return (
            <div>
                <NLayoutSet ref="n" layout={this.props.layout} first={this.props.form} />
            </div>
        );
    }
}

AssetForm.propTypes = {
    layout: PropTypes.object,
    form: PropTypes.object
};

AssetForm.defaultProps = {
    layout: {
        type: "A"
    },
    form: {
        type: "form",
        id: "theForm",
        title: "검색 조건",
        formType: "editor", // 입력 또는 Search Form 또는 Readonly
        buttomButtons: [
            {
                id: "save_btn",
                label: "저장",
                onClickEvent: "handleSaveBtn"
            }
        ],
        fieldSet: [{
            id: "editor_fields",
            columns: 3,
            fieldList: [
                { type: "text", id: "asset_nm", label: "자산명"},
                { type: "text", id: "asset_nm1", label: "자산명"},
                { type: "text", id: "asset_nm2", label: "자산명"},
                { type: "text", id: "asset_nm3", label: "자산명"},
                { type: "text", id: "asset_nm4", label: "자산명"},
                { type: "text", id: "asset_nm5", label: "자산명"},
                { type: "text", id: "asset_nm6", label: "자산명"},
                { type: "text", id: "asset_nm7", label: "자산명"},
                { type: "text", id: "asset_nm8", label: "자산명"},
                { type: "text", id: "asset_nm9", label: "자산명"},
                { type: "text", id: "asset_nm10", label: "자산명"},
                { type: "text", id: "asset_nm11", label: "자산명"},
                { type: "text", id: "asset_nm12", label: "자산명"},
                { type: "text", id: "asset_nm13", label: "자산명"},
                { type: "text", id: "asset_nm14", label: "자산명"},
                { type: "text", id: "asset_nm15", label: "자산명"},
                { type: "text", id: "asset_nm16", label: "자산명"},
                { type: "text", id: "asset_nm17", label: "자산명"},
                { type: "text", id: "asset_nm18", label: "자산명"},
                { type: "text", id: "asset_nm19", label: "자산명"},
                { type: "text", id: "asset_nm20", label: "자산명"},
                { type: "text", id: "asset_nm21", label: "자산명"},
                { type: "text", id: "asset_nm22", label: "자산명"},
                { type: "text", id: "asset_nm23", label: "자산명"},
                { type: "text", id: "asset_nm24", label: "자산명"},
                { type: "text", id: "asset_nm25", label: "자산명"},
                { type: "text", id: "asset_nm26", label: "자산명"},
                { type: "text", id: "asset_nm27", label: "자산명"},
                { type: "text", id: "asset_nm28", label: "자산명"},
                { type: "text", id: "asset_nm29", label: "자산명"},
                { type: "text", id: "asset_nm30", label: "자산명"}
            ]
        }]
    }
};

export default AssetForm;
