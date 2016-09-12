/**
 * MultiSelect component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/23
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.MultiSelect options={options} />
 *
 * Kendo MultiSelect 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

//var Util = require('../services/Util');

var MultiSelect = React.createClass({
    displayName: 'MultiSelect',
    propTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        className: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        data: PropTypes.object,
        items: PropTypes.array,
        placeholder: PropTypes.string,
        listField: PropTypes.string,
        dataTextField: PropTypes.string,
        dataValueField: PropTypes.string,
        multiple: PropTypes.bool,           // 다중선택을 지원하며, 닫히지 않고 여러개를 선택할 수 있다.
        headerTemplate: PropTypes.string,
        itemTemplate: PropTypes.string,
        tagTemplate: PropTypes.string,
        height: PropTypes.number,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onFiltering: PropTypes.func,
        onDataBound: PropTypes.func,
        minLength: PropTypes.number,            // 검색시 필요한 최소 단어 길이
        maxSelectedItems: PropTypes.number,     // 최대 선택 수
        parameterMapField: PropTypes.object,    // Paging, FilterJson
        serverFiltering: PropTypes.bool,    // 서버 Filtering(검색조건에 따른 리스트업)
        serverPaging: PropTypes.bool,   // 서버 Paging(멀티셀렉트 리스트 제한)
        pageSize: PropTypes.number,     // 서버사이드 Page Size
        filterFields: PropTypes.array   // 필터 필드 정의(or로 다중 검색시 제공)
    },
    id: '',
    onSelect: function(e) {
        var dataItem = this.multiSelect.dataSource.view()[e.item.index()];

        if(typeof this.props.onSelect !== 'undefined') {
            this.props.onSelect(e);
        }
    },
    onChange: function(e) {
        if(typeof this.props.onChange !== 'undefined') {
            this.props.onChange(e);
        }
    },
    onOpen: function(e) {
        if(typeof this.props.onOpen !== 'undefined') {
            this.props.onOpen(e);
        }
    },
    onClose: function(e) {
        if(typeof this.props.onClose !== 'undefined') {
            this.props.onClose(e);
        }
    },
    onFiltering: function(e) {
        if(typeof this.props.onFiltering !== 'undefined') {
            this.props.onFiltering(e);
        }
    },
    onDataBound: function(e) {

        if(typeof this.props.onDataBound !== 'undefined') {
        }
    },
    getOptions: function() {
        const { host, url, data, method, items, placeholder, listField, dataTextField, dataValueField, headerTemplate, itemTemplate, tagTemplate, height, multiple, minLength, maxSelectedItems, parameterMapField, serverFiltering, serverPaging, pageSize, filterFields } = this.props;

        var options = {
            placeholder: placeholder,
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            dataSource: []
        };

        if(multiple){
            $.extend(options, { autoClose: false });
        }

        if(minLength > 0){
            $.extend(options, { minLength: minLength });
        }

        if(maxSelectedItems !== null){
            $.extend(options, { maxSelectedItems: maxSelectedItems });
        }
        // dataSource
        // url
        if(typeof url !== 'undefined') {
            $.extend(options, { dataSource: {
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
                            // 데이터 읽어올때 필요한 데이터(ex:페이지관련)가 있으면 data를 copy한다.
                            for(let copy in parameterMapField){
                                if(typeof parameterMapField[copy] === "string" && ( copy in data )){
                                    data[parameterMapField[copy]] = data[copy];
                                }
                            }

                            if(parameterMapField.filtersToJson && data.filter && data.filter.filters){
                                // Filter Array => Json Object Copy
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
                        var listFields = [], dataList = response;
                        if(listField && listField.length > 0 && listField != 'null') {
                            listFields = listField.split('.');
                            listFields.map(
                                (field) => {
                                    dataList = dataList[field];
                                }
                            );
                        }
                        return dataList;
                    }
                },
                serverFiltering: serverFiltering,
                serverPaging: serverPaging,
                pageSize: pageSize
            } });

        }else if(typeof items !== 'undefined') {
            $.extend(options, { dataSource: items });
        }

        // headerTemplate
        if(typeof headerTemplate !== 'undefined') {
            $.extend(options, { headerTemplate: headerTemplate });
        }

        // itemTemplate
        if(typeof itemTemplate !== 'undefined') {
            $.extend(options, { itemTemplate: itemTemplate });
        }

        // tagTemplate
        if(typeof tagTemplate !== 'undefined') {
            $.extend(options, { tagTemplate: tagTemplate });
        }

        // height
        if(typeof height !== 'undefined') {
            $.extend(options, { height: height });
        }
        if(filterFields !== null && Array.isArray(filterFields)){
            $.extend(options, { filtering: function (e) {
                if (e.filter) {
                    let fields = filterFields;
                    var value = e.filter.value;

                    let newFields = [];
                    fields.map(field => {
                        newFields.push({
                            field: field,
                            operator: "contains",
                            value: value
                        });
                    });

                    var newFilter = {
                        filters: newFields,
                        logic: "or"
                    };
                    e.sender.dataSource.filter(newFilter);
                    e.preventDefault();
                }
                e.preventDefault();
            } });
        }
        return options;
    },
	getDefaultProps: function() {
		// 클래스가 생성될 때 한번 호출되고 캐시된다.
		// 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
		return {method: 'POST', listField: 'resultValue.list', placeholder: $ps_locale.select, dataTextField: 'text', dataValueField: 'value', multiple: false, minLength: 0, maxSelectedItems: null, serverFiltering: false, serverPaging: false, pageSize: 10, filterFields: null};
	},
    componentWillMount: function() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        let id = this.props.id;
        if(typeof id === 'undefined') {
            //id = Util.getUUID();
            id = "test";
        }
        this.id = id;
    },
    componentDidMount: function() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$multiSelect = $('#'+this.id);
        this.multiSelect = this.$multiSelect.kendoMultiSelect(this.getOptions()).data('kendoMultiSelect');

        // Events
        this.multiSelect.bind('select', this.onSelect);
        this.multiSelect.bind('change', this.onChange);
        this.multiSelect.bind('open', this.onOpen);
        this.multiSelect.bind('close', this.onClose);
        this.multiSelect.bind('filtering', this.onFiltering);
        this.multiSelect.bind('dataBound', this.onDataBound);
    },
    render: function() {
        // 필수 항목
        const { className, name, multiple } = this.props;

        return (
            <select id={this.id} name={name} multiple={multiple} className={classNames(className)}></select>
        );
    }
});

module.exports = MultiSelect;
