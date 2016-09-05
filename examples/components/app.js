import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import { Router, Route, Link, IndexRoute, browserHistory, hashHistory } from 'react-router';

import Home from './pages/Home';
import Abort from './pages/Abort';
import LayoutAExample from './pages/LayoutAExample';
import LayoutBExample from './pages/LayoutBExample';
import LayoutCExample from './pages/LayoutCExample';
import NoticeExample from './pages/NoticeExample';

import NConstraint from './constraints/NConstraint';

class App extends Component {
    constructor() {
        super(...arguments);
    }

    render() {
        return (
            <div>
                <Grid fluid={true}>
                    <Row className="show-grid">
                        <Col xs={2} md={2}>
                            <li>
                                <Link to="/layoutA">Layout A</Link>
                            </li>
                            <li>
                                <Link to="/layoutB">Layout B</Link>
                            </li>
                            <li>
                                <Link to="/layoutC">Layout C</Link>
                            </li>
                            <li>
                                <Link to="/notice">공지사항(B타입)</Link>
                            </li>
                            <li>
                                <Link to="/abort">메시지(리소스): {NConstraint.MESSAGE('res.common.list')}</Link>
                            </li>
                        </Col>
                        <Col xs={10} md={10}>
                            {this.props.children}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

App.propTypes = {};

App.defaultProps = {};

ReactDom.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/layoutA" component={LayoutAExample}/>
            <Route path="/layoutB" component={LayoutBExample}/>
            <Route path="/layoutC" component={LayoutCExample}/>
            <Route path="/notice" component={NoticeExample}/>
            <Route path="/abort" component={Abort}/>
        </Route>
    </Router>
), document.getElementById('app'));
