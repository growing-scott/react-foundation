import React, {Component, PropTypes} from 'react';

import NLayoutUtils from '../utils/NLayoutUtils';

/**
 * Layout A
 * 1개의 Layer로 구성된 Layout 구조
 */
class NLayoutA extends Component {
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

        return (
            <div className="row">
    			<div className="col-sm-12 col-lg-12">
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
            </div>
        );
    }
}

NLayoutA.propTypes = {};

export default NLayoutA;
