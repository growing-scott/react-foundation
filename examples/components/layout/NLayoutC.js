import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix, ButtonToolbar, Button} from 'react-bootstrap';

import NGrid from '../grid/NGrid';
import NTree from '../tree/NTree';
import NForm from '../forms/NForm';

/**
 * Layout C
 * 좌측|우측(상부|하부) 3개의 Layer로 구성된 Layout 구조
 */
class NLayoutC extends Component {
    constructor() {
        super(...arguments);
    }

    // Compoent Render 이후 이벤트
    componentDidMount() {}

    componentRender(component) {
        let render;
        switch (component.type) {
            case "grid":
                render = (<NGrid ref={component.id} grid={component}/>);
                break;
            case "tree":
                render = (<NTree ref={component.id} tree={component}/>);
                break;
            case "form":
                render = (<NForm ref={component.id} id={component.id} fieldSets={component.fieldSet}/>);
                break;
            default:
        }
        return render;
    }

    buttonRender(buttons) {
        let render;
        if (buttons) {
            render = (buttons.map((button) => {
                if (button.visible)
                    return <Button key={button.id} onClick={button.onClick}>{button.label}</Button>;
                }
            ));
        }
        return render;
    }

    render() {
        const {firstArea, secondArea, thirdArea} = this.props;

        // First Component
        let firstComponent = this.componentRender(firstArea);

        // Top Button 생성
        let firstTopComponent = this.buttonRender(firstArea.topButtons);

        // Bottom Button 생성
        let firstBottomComponent = this.buttonRender(firstArea.buttomButtons);

        // Second Component
        let secondComponent = this.componentRender(secondArea);

        // Top Button 생성
        let secondTopComponent = this.buttonRender(secondArea.topButtons);

        // Bottom Button 생성
        let secondBottomComponent = this.buttonRender(secondArea.buttomButtons);

        // Third Component
        let thirdComponent = this.componentRender(thirdArea);

        // Top Button 생성
        let thirdTopComponent = this.buttonRender(thirdArea.topButtons);

        // Bottom Button 생성
        let thirdBottomComponent = this.buttonRender(thirdArea.buttomButtons);

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

NLayoutC.propTypes = {};

export default NLayoutC;
