/**
 * FineUploader component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/27
 * author <a href="mailto:jyt@nkia.co.kr">Jung Young-Tai</a>
 *
 * example:
 * <Puf.FineUploader options={options} />
 *
 * FineUploader 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

//var Util = require('../services/Util');

var FineUploader = React.createClass({
    displayName: 'FineUploader',
    propTypes: {
        id: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        sessionUrl: PropTypes.string,   // 업로드된 초기 파일 Get Url
        uploadUrl: PropTypes.string,    // 파일 업로드 URL
        deleteUrl: PropTypes.string,    // 파일 삭제 URL
        params: PropTypes.object,       // 파일 업로드 파라미터
        sessionParams: PropTypes.object,    // 업로드된 초기 파일 Session Parameter
        autoUpload: PropTypes.bool,     // Auto Upload
        multiple: PropTypes.bool,       // 첨부파일 여러개 등록(선택) 가능 여부
        uploadedFileList: PropTypes.array,  // 업로드 파일 목록
        allowedExtensions: PropTypes.array, // 첨부파일 허용확장자
        itemLimit: PropTypes.number,    // 첨부파일 수 제한
        sizeLimit: PropTypes.number,    // 첨부파일 사이즈 제한
        emptyError: PropTypes.string,
        noFilesError: PropTypes.string,
        sizeError: PropTypes.string,
        tooManyItemsError: PropTypes.string,
        typeError: PropTypes.string,
        onDelete: PropTypes.func,
        onDeleteComplete: PropTypes.func,
        onComplete: PropTypes.func,
        onError: PropTypes.func,
        onSessionRequestComplete: PropTypes.func
    },
    id: '',
    $fineUploader: undefined,
	getDefaultProps: function() {
        return {autoUpload: true, multiple: true, params: {}, uploadedFileList: [], allowedExtensions: [], itemLimit: 0, sizeLimit: 0, emptyError: "0kb의 잘못된 파일입니다.", noFilesError: "첨부된 파일이 없습니다.", sizeError: "{file} is too large, maximum file size is {sizeLimit}!!.", tooManyItemsError: "Too many items ({netItems}) would be uploaded. Item limit is {itemLimit}!!.", typeError: "{file} has an invalid extension. Valid extension(s): {extensions}.!!"};
	},
    componentWillMount: function() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        let id = this.props.id;
        if(typeof id === 'undefined') {
            //id = Util.getUUID();
            id="test";
        }
        this.id = id;
    },
    getOptions: function(props) {
        let _this = this;
        const {host, sessionUrl, uploadUrl, deleteUrl, autoUpload, multiple, params, sessionParams, uploadedFileList, allowedExtensions, itemLimit, sizeLimit, emptyError, noFilesError, sizeError, tooManyItemsError, typeError, onDelete, onDeleteComplete, onComplete, onError, onSessionRequestComplete} = props;
        var options = {
            autoUpload: autoUpload,
            multiple: multiple,
            request: {
                endpoint: (host && host !== null && host.length > 0) ? host + uploadUrl : uploadUrl,
                params: params
            },
            validation: {
                allowedExtensions: allowedExtensions,
                itemLimit: itemLimit,
                sizeLimit: sizeLimit,
                tooManyItemsError: tooManyItemsError,
                typeError: typeError
            },
            messages: {
                emptyError: emptyError,
                noFilesError: noFilesError,
                sizeError: sizeError
            },
            session:{
                endpoint: (host && host !== null && host.length > 0) ? host + sessionUrl : sessionUrl,
                params: {"test": 1},
                refreshOnRequest:true
            },
            deleteFile:{
                enabled: true,
                method: 'POST',
                endpoint: (host && host !== null && host.length > 0) ? host + deleteUrl : deleteUrl
            },
            callbacks: {
                onDelete: function(id) {
                    if(typeof onDelete === 'function'){
                        onDelete(id);
                    }
                },
                // 삭제 버튼 클릭시 Event
                onSubmitDelete: function(id) {
                    _this.fineUploader.setDeleteFileParams({filename: _this.fineUploader.getName(id)}, id);
                },
                // 삭제 완료시 Event
                onDeleteComplete: function(id, xhr, isError) {
                    if(xhr.responseText){
                        let response = JSON.parse(xhr.responseText);
                        if("file_name" in response){
                            uploadedFileList.some((fileName, idx) =>{
                                if(fileName == response.file_name){
                                    return uploadedFileList.splice(idx, 1);
                                }
                            });
                        }
                    }
                    if(typeof onDeleteComplete === 'function'){
                        onDeleteComplete(id, xhr, isError);
                    }
                },
                // 업로드 완료시 Event
                onComplete: function(id, name, response, xhr){
                    if("file_name" in response){
                        _this.fineUploader.setUuid(id, response.file_name);
                        uploadedFileList.push(response.file_name);
                    }
                    if(typeof onComplete === 'function'){
                        onComplete(id, name, response, xhr);
                    }
                },
                // Error 발생 이벤트
                onError: function(id, name, errorReason, xhr){
                    if(typeof onError === 'function'){
                        onError(id, name, errorReason, xhr);
                    }
                },
                // 초기 File 목록 요청 완료시
                onSessionRequestComplete: function(response, success, xhr){
                    if(typeof onSessionRequestComplete === 'function'){
                        onSessionRequestComplete(response, success, xhr, this);
                    }
                }
            }
        };

        if(host && host !== null && host.length > 0){
            $.extend(options, {cors: {
                //all requests are expected to be cross-domain requests
                expected: true
                //if you want cookies to be sent along with the request
                //sendCredentials: true
            }});
        }

        return options;
    },
    componentDidMount: function() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$fineUploader = $('#'+this.id)[0];
        let settings = {
            element: this.$fineUploader
        };
        $.extend(settings, this.getOptions(this.props));
        this.fineUploader = new qq.FineUploader(settings);
    },
    componentWillReceiveProps: function(nextProps) {

    },
    // 첨부파일 업로드 Function
    uploadFiles: function(){
        this.fineUploader.uploadStoredFiles();
    },
    // 첨부파일 초기화 및 데이터 로드
    refreshSession: function(sessionParams){
        this.fineUploader.clearStoredFiles();
        this.fineUploader._session = null;
        this.fineUploader._options.session.params = sessionParams;
        this.fineUploader.reset();
    },
    render: function() {
        // 필수 항목
        return (
            <div>
                <div id={this.id}></div>
            </div>
        );
    }
});

module.exports = FineUploader;
