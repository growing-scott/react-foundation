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
        url: PropTypes.string,
        autoUpload: PropTypes.bool,
        multiple: PropTypes.bool
    },
    id: '',
    $fineUploader: undefined,
	getDefaultProps: function() {
        return {autoUpload: true, multiple: true};
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
        const {host, url, autoUpload, multiple} = props;
        var options = {
            autoUpload: autoUpload,
            multiple: multiple,
            request: {
                endpoint: (host && host !== null && host.length > 0) ? host + url : url
            },
            callbacks: {
                onDelete: function(id) {
                    // ...
                },
                onDeleteComplete: function(id, xhr, isError) {
                    //...
                },
                onComplete: function(id, name, response, xhr){
                    console.info(id);
                    console.info(name);
                    console.info(response);
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
        /*
        var link = document.querySelector('link[rel="import"]');

		// Clone the <template> in the import.
        console.info(link)
		var template = link.import.querySelector('#qq-template');
		var clone = document.importNode(template, true);

		document.querySelector('#templates').appendChild(clone);
        */

        this.$fineUploader = $('#'+this.id)[0];
        console.info(this.$fineUploader)
        let settings = {
            element: this.$fineUploader
        };
        $.extend(settings, this.getOptions(this.props));

        this.fineUploader = new qq.FineUploader(settings);
    },
    createMarkUp: function(){
        let template = '<template id="qq-template">';
        template += '<div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">';
        template += '		   <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">';
        template += '</template>';
        return {__html: template};
    },
    componentWillReceiveProps: function(nextProps) {

    },
    uploadFiles: function(){
        this.fineUploader.uploadStoredFiles();
    },
    markup: function() {
        return { __html: "test" };
    },
    render: function() {
        // 필수 항목
        var inputStyle = {
            width: "100%"
        };
        const { className } = this.props;

        return (
            <div>
                <div id={this.id}></div>
                {/*<div dangerouslySetInnerHTML={this.createMarkUp()} />*/}
            </div>
        );
    }
});

module.exports = FineUploader;
