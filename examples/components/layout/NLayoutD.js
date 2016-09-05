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

        return (
            <Grid>
                <Row className="show-grid">
                    <Col xs={4} md={4}>
                        <h1>1영역</h1>
                        {firstTopComponent}
                        {firstComponent}
                        {firstBottomComponent}
                    </Col>
                    <Col xs={8} md={8}>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <h1>2영역</h1>
                                {secondTopComponent}
                                {secondComponent}
                                {secondBottomComponent}
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <h1>3영역!</h1>
                                {thirdTopComponent}
                                {thirdComponent}
                                {thirdBottomComponent}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

NLayoutD.propTypes = {};

export default NLayoutD;
