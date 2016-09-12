/**
 * AutoComplete component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/09
 * author <a href="mailto:jyt@nkia.co.kr">Jung Young-Tai</a>
 *
 * example:
 * <Puf.AutoComplete options={options} />
 *
 * Kendo AutoComplete 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

//var Util = require('../services/Util');

var AutoComplete = React.createClass({
    displayName: 'AutoComplete',
    propTypes: {
        id: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        data: PropTypes.object,
        placeholder: PropTypes.string,
        dataSource: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        listField: PropTypes.string,
        template: PropTypes.string,
        filter: PropTypes.string,
        separator: PropTypes.string,
        minLength: PropTypes.number,
        dataTextField: PropTypes.string,
        parameterMapField: PropTypes.object  // Parameter Control 객체(필터처리)
    },
    id: '',
    $autoComplete: undefined,
	getDefaultProps: function() {
		// 클래스가 생성될 때 한번 호출되고 캐시된다.
		// 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return {method: 'POST', listField: 'resultValue.list', totalField: 'resultValue.totalCount', filter: "startswith", separator: ", ", template: null, dataTextField: null, minLength: 1};
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
    getDataSource: function(props) {
        const {host, url, method, data, listField, totalField, parameterMapField} = props;

        let dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: (host && host !== null && host.length > 0) ? host + url : url,
                    type: method,
                    dataType: 'json',
                    data: data,      // search (@RequestBody GridParam gridParam 로 받는다.)
                    contentType: 'application/json; charset=utf-8'
                },
                parameterMap: function(data, type) {
                    if(type == "read" && parameterMapField !== null){
                        // Filter Array => Json Object Copy
                        if(parameterMapField.filtersToJson && data.filter && data.filter.filters){
                            let filters = data.filter.filters;
                            filters.map((filter) => {
                                let field = (parameterMapField.filterPrefix) ? parameterMapField.filterPrefix + filter.field : filter.field;
                                if(parameterMapField.filterFieldToLowerCase){
                                    data[field.toLowerCase()] = filter.value;
                                }else{
                                    data[field] = filter.value;
                                }
                            });
                        }
                    }
                    return JSON.stringify(data);
                }
            },
            schema: {
                // returned in the "listField" field of the response
                data: function(response) {
                    var arr = [], gridList = response;

                    if(listField && listField.length > 0 && listField != 'null') {
                        arr = listField.split('.');
                    }
                    for(var i in arr) {
                        //console.log(arr[i]);
                        if(!gridList) {
                            gridList = [];
                            break;
                        }
                        gridList = gridList[arr[i]];
                    }
                    return gridList;
                },
                // returned in the "totalField" field of the response
                total: function(response) {
                    //console.log(response);
                    var arr = [], total = response;
                    if(totalField && totalField.length > 0 && totalField != 'null') {
                        arr = totalField.split('.');
                    }
                    for(var i in arr) {
                        //console.log(arr[i]);
                        if(!total) {
                            total = 0;
                            break;
                        }
                        total = total[arr[i]];
                    }
                    return total;
                }
            },
            serverFiltering: true
        });
        return dataSource;
    },
    getOptions: function(props) {
        const {template, dataTextField, minLength, separator} = props;
        var dataSource = this.getDataSource(props);

        var options = {
            template: template,
            dataSource: dataSource,
            dataTextField: dataTextField,
            minLength: minLength,
            separator: separator
        };
        return options;
    },
    componentDidMount: function() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$autoComplete = $('#'+this.id);
        //console.log(this.getOptions(this.props));
        this.autoComplete = this.$autoComplete.kendoAutoComplete(this.getOptions(this.props));
    },
    componentWillReceiveProps: function(nextProps) {

    },
    render: function() {
        // 필수 항목
        var inputStyle = {
            width: "100%"
        };
        const { className } = this.props;
        return (
            <input id={this.id} className={classNames(className)} style={inputStyle} />
        );
    }
});

module.exports = AutoComplete;
