import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

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

        return (
            <Row className="show-grid">
                <Col xs={12} md={12}>
                    <h1>1영역</h1>
                    {firstTopComponent}
                    {firstComponent}
                    {firstBottomComponent}
                </Col>
            </Row>
        );
    }
}

NLayoutA.propTypes = {};

export default NLayoutA;
