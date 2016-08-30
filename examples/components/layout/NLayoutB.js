import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import NGrid from '../grid/NGrid';
import NForm from '../forms/NForm';

/**
 * Layout B
 * 상부|하부 2개의 Layer로 구성된 Layout 구조
 */
class NLayoutB extends Component{
  constructor() {
    super(...arguments);
  }

  // Compoent Render 이후 이벤트
  componentDidMount() {

  }

  render(){
    let first = this.props.firstArea;
    let firstComponent;
    switch (first.type) {
      case "grid":
        firstComponent = (<NGrid grid={first} />);
        break;
      case "form":
        firstComponent = (<NForm name={first.name} fieldSets={first.fieldSet} topButtons={first.topButtons} buttomButtons={first.buttomButtons} />);
        break;
      default:
    }

    let second = this.props.secondArea;
    let secondComponent;
    switch (second.type) {
      case "grid":
        secondComponent = (<NGrid grid={second} />);
        break;
      case "form":
        secondComponent = (<NForm name={second.name} fieldSets={second.fieldSet} topButtons={second.topButtons} buttomButtons={second.buttomButtons}  />);
        break;
      default:
    }

    return(
      <Grid>
          <Row className="show-grid">
            <Col xs={12} md={12}><h1>1영역</h1>{firstComponent}</Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={12}><h1>2영역</h1>{secondComponent}</Col>
          </Row>
      </Grid>
    )
  }
}

NLayoutB.propTypes = {

}

export default NLayoutB;
