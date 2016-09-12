import React, {Component, PropTypes} from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';

import NConstraint from '../constraints/NConstraint';

class NMultiSelectBox extends Component {
    constructor() {
        super(...arguments);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {

    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
    }

    render() {
        const { id, items, placeholder, url, data, dataTextField, dataValueField, minLength, serverFiltering, serverPaging, itemTemplate, maxSelectedItems, multiple, help } = this.props;
        return (
            <FormGroup controlId={id}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <Puf.MultiSelect
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    data={data}
                    host={NConstraint.HOST}
                    url={url}
                    listField={NConstraint.GRID_LIST_FIELD}
                    dataTextField={dataTextField}
                    dataValueField={dataValueField}
                    minLength={minLength}
                    maxSelectedItems={maxSelectedItems}
                    parameterMapField={NConstraint.GRID_PARAMTER_MAP_FIELD}
                    serverFiltering={serverFiltering}
                    serverPaging={serverPaging}
                    itemTemplate={itemTemplate}
                    items={items}
                    multiple={multiple}
                    />
                <HelpBlock>{help}</HelpBlock>
            </FormGroup>
        );
    }
}

NMultiSelectBox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default NMultiSelectBox;
