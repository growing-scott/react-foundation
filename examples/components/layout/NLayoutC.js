import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import NGrid from '../grid/NGrid';
import NTree from '../tree/NTree';
import NForm from '../forms/NForm';

/**
 * Layout C
 * 좌측|우측(상부|하부) 3개의 Layer로 구성된 Layout 구조
 */
class NLayoutC extends Component{
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
      case "tree":
        firstComponent = (<NTree tree={first} />);
        break;
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
      case "tree":
        secondComponent = (<NTree tree={second} />);
        break;
      case "grid":
        secondComponent = (<NGrid grid={second} />);
        break;
      case "form":
        secondComponent = (<NForm name={second.name} fieldSets={second.fieldSet} topButtons={second.topButtons} buttomButtons={second.buttomButtons}  />);
        break;
      default:
    }

    let third = this.props.thirdArea;
    let thirdComponent;
    switch (third.type) {
      case "tree":
        thirdComponent = (<NTree tree={third} />);
        break;
      case "grid":
        thirdComponent = (<NGrid grid={third} />);
        break;
      case "form":
        thirdComponent = (<NForm name={third.name} fieldSets={third.fieldSet} topButtons={third.topButtons} buttomButtons={third.buttomButtons}  />);
        break;
      default:
    }

    return(
      <Grid>
          <Row className="show-grid">
            <Col xs={4} md={4}><h1>1영역</h1>{firstComponent}</Col>
            <Col xs={8} md={8}>
              <Row className="show-grid">
                  <Col xs={12} md={12}><h1>2영역</h1>{secondComponent}</Col>
              </Row>
              <Row className="show-grid">
                  <Col xs={12} md={12}><h1>3영역</h1>{thirdComponent}</Col>
              </Row>
            </Col>
          </Row>
      </Grid>
    );
  }
}

NLayoutC.propTypes = {

};

export default NLayoutC;
