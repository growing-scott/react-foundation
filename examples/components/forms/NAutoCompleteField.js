import React, {Component, PropTypes} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import NConstraint from '../constraints/NConstraint';

class NAutoCompleteField extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: "",
            visible: true
        };
        this.setValue = this.setValue.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        this.setState({visible: this.props.visible});
    }

    // setValue method
    setValue(value) {
        this.setState({value: value});
    }

    // Value값 변경에 따른 이벤트 처리
    handleChange(e) {
        this.setState({value: e.target.value});
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        if (this.props.value) {
            this.setState({value: this.props.value});
        }
    }

    // Props 변경 이벤트
    componentWillReceiveProps(nextProps) {
        // Props 변경으로 Visible 제어(true|false)
        if (this.props.visible !== nextProps.visible) {
            this.setState({visible: nextProps.visible});
        }
    }

    render() {
        console.info(this);

        const { id, label, url, data, placeholder, template, parameterMapField, dataTextField, help } = this.props;

        return (
            <FormGroup>
                <ControlLabel>{label}</ControlLabel>
                <Puf.AutoComplete
                    name={id}
                    host={NConstraint.HOST}
                    url={url}
                    listField={NConstraint.GRID_LIST_FIELD}
                    data={data}
                    template={template}
                    dataTextField={dataTextField}
                    parameterMapField={parameterMapField} />
                <HelpBlock>{help}</HelpBlock>
            </FormGroup>
        );
    }
}

NAutoCompleteField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    url: PropTypes.string,
    data: PropTypes.object,
    template: PropTypes.string,
    parameterMapField: PropTypes.object
};

export default NAutoCompleteField;
