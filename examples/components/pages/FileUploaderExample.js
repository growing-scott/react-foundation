import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';
import FineUploader from '../third_party/FineUploader';

class FileUploaderExample extends Component {
    constructor() {
        super(...arguments);

        this.doFileUpload = this.doFileUpload.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {

    }

    doFileUpload(){
        this.refs.file.uploadFiles();
    }

    render() {
        return (
            <div>
                <FineUploader ref="file" host="http://localhost:8090" url="/itg/base/initRegistAtchFile.do" autoUpload={false} />
                <button onClick={this.doFileUpload}>업로드버튼</button>
            </div>
        );
    }
}

FileUploaderExample.propTypes = {
	links: PropTypes.object
};

FileUploaderExample.defaultProps = {
};

export default FileUploaderExample;
