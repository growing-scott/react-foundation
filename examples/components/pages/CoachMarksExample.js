import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';
import {Modal, Button} from 'react-bootstrap';

class CoachMarksExample extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            showModal: false
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.doCoachMarks = this.doCoachMarks.bind(this);
        this.nextCoarhMark = this.nextCoarhMark.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {

    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        /*
        $(".hasCoach").coachy({
            on: "mouseover",
            off: "mouseout",
            selector: '.hasCoach2'
        });
        */
        /*
        $(".hasCoach2").coachy({
            //on: "mouseover",
            //off: "mouseout",
            autoOpen: true,
            life:3000,
            message: "If you click there you'll see",
            selector: '.hasCoach1'
        });
        */
        /*
        $("#test").coachy({
            on: "mouseover",
            off: "mouseout",
            message: "버튼을 클릭하시면 입력된 내용이 저장됩니다."
        });
        */
        /*
        $(".hasCoach").coachy({
            autoOpen: true,
            life:3000,
            message: "주요 입력항목 입니다.",
            selector: '.hasCoach'
        });
        */
    }

    doCoachMarks(){
        this.open();
    }

    nextCoarhMark(){
        this.close();

        $(".hasCoach").coachy({
            autoOpen: true,
            life:3000,
            message: "주요 입력항목 입니다.",
            selector: '.hasCoach'
        });

        window.setTimeout(function(){
            $("#saveBtn").coachy({
                autoOpen: true,
                life:3000,
                message: "공지사항을 작성하시고 저장 버튼을 누르시면 저장됩니다.",
            });

            window.setTimeout(function(){
                $("#deleteBtn").coachy({
                    autoOpen: true,
                    life:3000,
                    message: "삭제 대상을 목록에서 선택하시고 삭제버튼을 누르시면 공지사항이 삭제됩니다. ※삭제된 데이터는 복구되지 않습니다.",
                });
            }, 3500);
        }, 3500);
    }

    open(){
        this.setState({
            showModal: true
        });
    }

    close(){
        this.setState({
            showModal: false
        });
    }

    render() {
        let style1 = {position:"relative",  zIndex: 1};
        let style2 = {position:"absolute",  zIndex: 1,  top:"100px", left:"30%", backgroundColor: "white"};
        let style3 = {position:"relative",  zIndex: 1};
        return (
            <div>
                {/*
                <div className="hasCoach" style={style1}>
                    <span>Hover here</span>
                </div>
                <div className="hasCoach2" style={style2}>
                    <span>Hover here</span>
                </div>
                <div className="hasCoach2" style={style3}>
                    <span>Hover here</span>
                </div>
                 <div className="hasCoach" style={style4}>
                    <span>Hover here</span>
                </div>
                <div className="hasCoach" style={style5}>
                    <span>Hover here</span>
                </div>
                <div className="hasCoach" style={style6}>
                    <span>Hover here</span>
                </div>
                <div className="hasCoach" style={style7}>
                    <span>Hover here</span>
                </div>
                <div className="hasCoach hasCoach1" style={style8}>
                    <span>Hover here</span>
                </div>
                */}
                <button onClick={this.doCoachMarks}>튜토리얼</button>
                <div>
    				<label htmlFor="id" className="hasCoach" style={style1}>제목</label>
    				<input type="text" className="form-control" />
    			</div>
                <div>
    				<label htmlFor="id2" className="hasCoach" style={style1}>내용</label>
    				<textarea rows={10} cols={10} className="form-control" />
    			</div>
                <button id="saveBtn" style={style3}>저장</button>
                <button id="deleteBtn" style={style3}>삭제</button>
                <button id="test" className="hasCoach3">테스트 버튼</button>
                {/* Modal */}
                <Modal show={this.state.showModal} onHide={this.close} bsSize="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>메뉴얼</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h1>공지사항</h1>
                        <h4>공지사항을 등록/수정/삭제하는 기능으로 관리자가 등록하면 사용자 Home 화면에 공지사항이 보이게됩니다.</h4>
                        <h4>제목, 내용은 필수로 입력하는 항목입니다.</h4>
                        <h4>다음 튜토리얼을 진행하시려면 [다 음] 버튼을 클릭해주세요.</h4>
                        <h4>진행을 원하시지 않는다면 [닫 기] 버튼을 클릭해주세요.</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <button id="next" type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.nextCoarhMark}>다 음</button>
                        <button id="close" type="button" className="btn btn-default" data-dismiss="modal" onClick={this.close}>닫 기</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

CoachMarksExample.propTypes = {
	links: PropTypes.object
};

CoachMarksExample.defaultProps = {
};

export default CoachMarksExample;
