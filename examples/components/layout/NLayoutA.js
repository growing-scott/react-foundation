import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import NGrid from '../grid/NGrid';
import NForm from '../forms/NForm';

class NLayoutA extends Component{
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
        firstComponent = (<NForm name={first.name} fieldSets={second.fieldSet} />);
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
        secondComponent = (<NForm name={second.name} fieldSets={second.fieldSet}  />);
        break;
      default:
    }

    console.info(firstComponent);
    console.info(secondComponent);

    return(
      <Grid>
          <Row className="show-grid">
            <Col xs={4} md={4}>{firstComponent}</Col>
            <Col xs={8} md={8}>{secondComponent}</Col>
          </Row>
      </Grid>
    )
  }
}

NLayoutA.propTypes = {

}

export default NLayoutA;
