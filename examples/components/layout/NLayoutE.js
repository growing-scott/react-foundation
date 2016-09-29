import React, {Component, PropTypes} from 'react';

import NLayoutUtils from '../utils/NLayoutUtils';

/**
 * Layout E
 * 1개의 Layer로 구성된 Layout 구조
 */
class NLayoutE extends Component {
    constructor() {
        super(...arguments);
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    render() {
        const {firstArea} = this.props;

        // First Component
        let firstComponent = NLayoutUtils.ComponentRender(firstArea);

        // Top Button 생성
        let firstTopComponent = NLayoutUtils.ButtonRender(firstArea.topButtons);

        // Bottom Button 생성
        let firstBottomComponent = NLayoutUtils.ButtonRender(firstArea.buttomButtons);

        let firstHrefId = "#"+ firstArea.id;

        let navbarStyle = {
            backgroundColor: "rgba(255,255,255,1)",
            borderTop: "1px solid #428bca",
            borderBottom: "1px solid #428bca",
            borderLeft: "1px solid #428bca",
            borderRight: "1px solid #428bca",
            width: "115px",
            right: "50px",
            position: "fixed"
        };

        return (
            <div>
                <div className="row">
                    <div className="col-sm-12 col-lg-12">
                        <nav className="navbar navbar-default navbar-static-top" data-spy="affix" data-offset-top="0" style={navbarStyle}>
                            <div className="container-fluid">
                                <ul className="nav">
                                    <li className="text-center">
                                        <a id="req-menu-control-btn">
                                            <h3 style={{marginTop: "0px", marginBottom: "0px"}}>
                                                <span id="req-menu-control-icon" className="glyphicon glyphicon-collapse-up" aria-hidden="true"></span>
                                            </h3>
                                        </a>
                                    </li>
                                </ul>
                                <ul id="req-menu-ul" className="nav nav-pills nav-stacked">
                                    <li className="text-center">
                                        <p id="req-detail-pop-btn" className="navbar-btn">
                                            <a href="#" className="btn btn-info btn-margin-bottom">상세보기</a>
                                        </p>
                                    </li>
                                    <li className="text-center">
                                        <p className="navbar-btn">
                                            등　　록
                                        </p>
                                    </li>
                                    <li className="text-center">
                                        <p className="navbar-btn">
                                            반　　려
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-lg-12">
                        <div className="text-right">
                            {firstTopComponent}
                        </div>
                        {firstComponent}
                        <div className="text-right">
                            {firstBottomComponent}
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

NLayoutE.propTypes = {};

export default NLayoutE;
