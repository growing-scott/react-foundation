import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

import { Router, Route, Link, IndexRoute, browserHistory, hashHistory } from 'react-router';

import Home from './pages/Home';
import Abort from './pages/Abort';
import LayoutAExample from './pages/LayoutAExample';
import LayoutBExample from './pages/LayoutBExample';
import LayoutCExample from './pages/LayoutCExample';
import LayoutDExample from './pages/LayoutDExample';
import NoticeExample from './pages/NoticeExample';
import NoticeExampleA from './pages/NoticeExampleA';
import NoticeFormExampleA from './pages/NoticeFormExampleA';

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
                                <Link to="/layoutD">Layout D</Link>
                            </li>
                            <li>
                                <Link to="/notice">공지사항(C타입-현재)</Link>
                            </li>
                            <li>
                                <Link to="/noticeA">공지사항(A타입-디테일)</Link>
                            </li>
                            <li>
                                <Link to="/noticeB">공지사항(A타입-팝업)</Link>
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
            <Route path="/layoutD" component={LayoutDExample}/>
            <Route path="/notice" component={NoticeExample}/>
            <Route path="/noticeA" component={NoticeExampleA}/>
            <Route path="/noticeFormExampleA/:no_id" component={NoticeFormExampleA}/>
            <Route path="/abort" component={Abort}/>
        </Route>
    </Router>
), document.getElementById('app'));
