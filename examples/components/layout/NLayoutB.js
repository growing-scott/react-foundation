import React, {Component, PropTypes} from 'react';

import NLayoutUtils from '../utils/NLayoutUtils';

/**
 * Layout B
 * 좌측|우측 2개의 Layer로 구성된 Layout 구조
 */
class NLayoutB extends Component {
    constructor() {
        super(...arguments);
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    render() {
        const {firstArea, secondArea} = this.props;

        // First Componenscvt
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

        let firstHrefId = "#"+ firstArea.id;
        let secondHrefId = "#"+ secondArea.id;

        return (
            <div className="row">
    			<div className="col-sm-4 col-lg-4">
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
                <div className="col-sm-8 col-lg-8">
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
        );
    }
}

NLayoutB.propTypes = {};

export default NLayoutB;
