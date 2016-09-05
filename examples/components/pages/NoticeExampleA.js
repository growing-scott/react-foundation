import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import { hashHistory } from 'react-router';

import NLayoutSet from '../layout/NLayoutSet';

import NConstraint from '../constraints/NConstraint';
import NControlUtils from '../utils/NControlUtils';

class NoticeExampleA extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            updateLayout: false
        };
        this.getRefs = this.getRefs.bind(this);
        this.updateLayout = this.updateLayout.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        // 최초 초기화 처리
        this.initRender();
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    // Refs 정의
    getRefs(type) {
        let ref;
        switch (type) {
            case "form":
                ref = this.refs.n.refs.notice.refs.theForm;
                break;
            default:
        }
        return ref;
    }

    // 렌더 초기화 핸들러
    initRender() {
        const {grid} = this.props;

        // 버튼 Event bind
        NControlUtils.bindButtonEvent(this, grid.topButtons);

        // Grid Event bind
        NControlUtils.bindEvent(this, grid, grid.onSelectRowEvent, "onSelectRow");

        // visible 제어
        //NControlUtils.setVisible(form.buttomButtons, ["save_btn", "cancel_btn"], false);
    }

    // Grid 선택 이벤트
    onSelectRowGrid(dataSet) {
        const {grid} = this.props;

        hashHistory.push({
            pathname: '/noticeFormExampleA/' + dataSet.data.NO_ID,
            state: { no_id: dataSet.data.NO_ID }
        });
    }

    // 신규등록
    doNew() {
        const {grid, form} = this.props;

        NControlUtils.setVisible(grid.topButtons, ["new_btn"], false);
        NControlUtils.setVisible(form.buttomButtons, ["save_btn", "cancel_btn"], true);
        NControlUtils.setVisible(form.buttomButtons, ["delete_btn"], false);

        this.updateLayout();


    }

    // 엑셀다운로드
    doExcelDownload() {
        alert("엑셀다운로드 구현예정");
    }

    // 저장
    doSave() {
        let _this = this;
        let form = this.getRefs("form");

        if (form.getValidation().validate()) {
            let params = _this.getRefs("form").getFormValuesForMap();
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/system/board/insertNoticeBoardInfo.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(params),
                success: function(data) {
                    alert("저장되었습니다.");
                    _this.getRefs("grid").refresh();
                    _this.updateLayout();
                }
            });
        }
    }

    // 삭제
    doDelete() {
        let _this = this;
        let form = this.getRefs("form");

        if (form.getValidation().validate()) {
            let params = _this.getRefs("form").getFormValuesForMap();
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/system/board/deleteNoticeBoardInfo.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(params),
                success: function(data) {
                    alert("삭제되었습니다.");
                    _this.getRefs("grid").refresh();
                    _this.updateLayout();
                }
            });
        }
    }

    doCancel() {
        const {grid, form} = this.props;

        NControlUtils.setVisible(grid.topButtons, ["new_btn"], true);
        NControlUtils.setVisible(form.buttomButtons, ["save_btn", "delete_btn", "cancel_btn"], false);

        this.updateLayout();
    }

    // Layout Update
    updateLayout() {
        this.setState({updateLayout: true});
    }

    render() {
        return (
            <div>
                <NLayoutSet ref="n" layout={this.props.layout} first={this.props.grid} />
            </div>
        );
    }
}

NoticeExampleA.propTypes = {
    layout: PropTypes.object,
    grid: PropTypes.object
};

NoticeExampleA.defaultProps = {
    layout: {
        id: "notice",
        type: "A"
    },
    grid: {
        type: "grid",
        id: "theGrid",
        title: "공지사항 목록",
        url: "/itg/system/board/searchNoticeBoardList.do",
        resource: "grid.board.notice",
        paging: true,
        selectable: "row",
        params: {
            start: 1,
            page: 1,
            limit: 20
        },
        onSelectRowEvent: "onSelectRowGrid",
        topButtons: [
            {
                id: "new_btn",
                label: "신규등록",
                onClickEvent: "doNew"
            }, {
                id: "excel_btn",
                label: "엑셀다운로드",
                onClickEvent: "doExcelDownload"
            }
        ]
    }
};

export default NoticeExampleA;
