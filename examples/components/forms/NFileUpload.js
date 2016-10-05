import React, {Component, PropTypes} from 'react';

import NConstraint from '../constraints/NConstraint';

class NFileUpload extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            visible: true
        };
        this.onSessionRequestComplete = this.onSessionRequestComplete.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        this.setState({visible: this.props.visible});
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

    onSessionRequestComplete(response, success, xhr, fineUploader){
        let fileList = response;
        if(fileList.length > 0){
            fileList.forEach((file, idx) => {
                let fileSelector = qq(fineUploader.getItemByFileId(idx)).getByClass('qq-upload-file-selector')[0];
                $(fileSelector).replaceWith("<span class='qq-upload-file-selector qq-upload-file' title="+file.name+"><a href='http://localhost:8090/itg/base/downloadAtchFile.do?atch_file_id="+file.atch_file_id+"&file_idx="+file.file_idx+"' download='"+file.name+"'>"+file.name+"</a></span>" );
            });
        }
    }

    render() {
        const {id, placeholder, required} = this.props;

        const sessionUrl = "/itg/base/selectAjaxAtchFileList.do";
        const uploadUrl = "/itg/base/ajaxFileUpload.do";
        const deleteUrl = "/itg/base/ajaxRemoveFile.do";

        let formGroupClassName = "form-group";

        if(!this.state.visible){
            formGroupClassName = formGroupClassName + " hidden";
        }
        return (
            <div ref={id} className={formGroupClassName}>
				<label htmlFor={id}>{this.props.label}</label>
                <Puf.FineUploader ref="file" host={NConstraint.HOST} sessionUrl={sessionUrl} uploadUrl={uploadUrl} deleteUrl={deleteUrl} onSessionRequestComplete={this.onSessionRequestComplete} />
			</div>
        );
    }
}

NFileUpload.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string
};

export default NFileUpload;
