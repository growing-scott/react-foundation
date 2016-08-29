import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import NGrid from '../grid/NGrid';
import NForm from '../forms/NForm';

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
        firstComponent = (<NGrid url={first.url} />);
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
        secondComponent = (<NGrid url={second.url} />);
        break;
      case "form":
        secondComponent = (<NForm name={second.name} fieldSets={second.fieldSet} topButtons={second.topButtons} buttomButtons={second.buttomButtons}  />);
        break;
      default:
    }

    return(
      <Grid>
          <Row className="show-grid">
            <Col xs={12} md={12}>{firstComponent}</Col>
          </Row>
          <Row className="show-grid">
            <Col xs={12} md={12}>{secondComponent}</Col>
          </Row>
      </Grid>
    )
  }
}

NLayoutB.propTypes = {

}

export default NLayoutB;
