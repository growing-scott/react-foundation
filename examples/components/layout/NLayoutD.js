import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import NLayoutUtils from '../utils/NLayoutUtils';

/**
 * Layout D
 * 좌측|우측(상부|하부) 3개의 Layer로 구성된 Layout 구조
 */
class NLayoutD extends Component {
    constructor() {
        super(...arguments);
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    render() {
        const {firstArea, secondArea, thirdArea} = this.props;

        // First Component
        let firstComponent = NLayoutUtils.ComponentRender(firstArea);

        // Top Button 생성
        let firstTopComponent = NLayoutUtils.ButtonRender(firstArea.topButtons);

        // Bottom Button 생성
        let firstBottomComponent = NLayoutUtils.ButtonRender(firstArea.buttomButtons);

        // Second Component
        let secondComponent = NLayoutUtils.ComponentRender(secondArea);

        // Top Button 생성
        let secondTopComponent = NLayoutUtils.ButtonRender(secondArea.topButtons);

        // Bottom Button 생성
        let secondBottomComponent = NLayoutUtils.ButtonRender(secondArea.buttomButtons);

        // Third Component
        let thirdComponent = NLayoutUtils.ComponentRender(thirdArea);

        // Top Button 생성
        let thirdTopComponent = NLayoutUtils.ButtonRender(thirdArea.topButtons);

        // Bottom Button 생성
        let thirdBottomComponent = NLayoutUtils.ButtonRender(thirdArea.buttomButtons);

        let firstHrefId = "#"+ firstArea.id;
        let secondHrefId = "#"+ secondArea.id;
        let thirdHrefId = "#"+ thirdArea.id;

        return (
            <div>
                <div className="row">
        			<div className="col-sm-2 col-lg-2">
                        <div className="panel panel-default">
                            <div className="panel-heading">
    							<a data-toggle="collapse" href={firstHrefId}>▶ {firstArea.title}</a>
    						</div>
                            <div id={firstArea.id} className="panel-body collapse in">
    							<div className="row">
    								<div className="col-sm-12 col-lg-12">
    									<h3><b>{firstArea.title}</b></h3>
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
                        </div>
                    </div>
                    <div className="col-sm-10 col-lg-10">
                        <div className="row">
                			<div className="col-sm-12 col-lg-12">
                        		<div className="panel panel-default">
                                    <div className="panel-heading">
            							<a data-toggle="collapse" href={secondHrefId}>▶ {secondArea.title}</a>
            						</div>
                                    <div id={secondArea.id} className="panel-body collapse in">
            							<div className="row">
            								<div className="col-sm-12 col-lg-12">
            									<h3><b>{secondArea.title}</b></h3>
            									<div className="text-right">
            										{secondTopComponent}
            									</div>
                                                {secondComponent}
                                                <div className="text-right">
                                                    {secondBottomComponent}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                			<div className="col-sm-12 col-lg-12">
                        		<div className="panel panel-default">
                                    <div className="panel-heading">
            							<a data-toggle="collapse" href={thirdHrefId}>▶ {thirdArea.title}</a>
            						</div>
                                    <div id={thirdArea.id} className="panel-body collapse in">
            							<div className="row">
            								<div className="col-sm-12 col-lg-12">
            									<h3><b>{thirdArea.title}</b></h3>
            									<div className="text-right">
            										{thirdTopComponent}
            									</div>
                                                {thirdComponent}
                                                <div className="text-right">
                                                    {thirdBottomComponent}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

NLayoutD.propTypes = {};

export default NLayoutD;
