import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import {Grid, Row, Col, Clearfix, Tabs, Tab} from 'react-bootstrap';

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
import NoticeExampleB from './pages/NoticeExampleB';
import TabsExample from './pages/TabsExample';
import FormExample from './pages/FormExample';

import NConstraint from './constraints/NConstraint';

import NLayoutUtils from './utils/NLayoutUtils';

class App extends Component {
    constructor(props, context) {
        super(...arguments);
    }

    getChildContext(){
        return {
            notification: this.props.app.notification
        };
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {

    }

    // Compoent Render 이후 이벤트
    componentDidMount() {
        //window.onhashchange = this.handleHashChange;

        // Notification 설정
        this.props.app.notification = NLayoutUtils.Notification("notification");

        //console.info(this.context);
        //console.info(this);
        //this.context.router.push("/layoutA");


    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default navbar-static-top">
                	<div className="container">
                		<div className="navbar-header">
                			<a className="navbar-brand" href="itsm_main.jsp">React Prototype</a>
                		</div>
                		<div id="navbar" className="navbar-collapse">
                			<ul className="nav navbar-nav">
                				<li><a>Layout</a></li>
                				<li><a href="#" data-toggle="modal" data-target="#reqModal">Examples</a></li>
                			</ul>
                			<ul className="nav navbar-nav navbar-right">
                				<li><a>사이트맵</a></li>
                				<li><a>개인정보변경</a></li>
                				<li><a href="#">로그아웃</a></li>
                			</ul>
                		</div>
                	</div>
                </nav>

                {/* Modal */}
                <div id="reqModal" className="modal fade" role="dialog">
                	<div className="modal-dialog modal-lg">
                		{/*  Modal content */}
                		<div className="modal-content">
                			<div className="modal-header">
                				<button type="button" className="close" data-dismiss="modal">&times;</button>
                				<h4 className="modal-title"><b>Examples</b></h4>
                			</div>
                			<div className="modal-body">
                				<div className="row">
                					<div className="col-sm-4 col-lg-4">
                						<div className="panel panel-default">
                							<div className="panel-heading">
                								<span className="glyphicon glyphicon-book" aria-hidden="true"></span>
                                                &nbsp;Layout
                							</div>
                							<div className="panel-body">
                								<div >
                									<Link to="/layoutA" onClick={() => $("#close").click()}>- Layout A</Link>
                								</div>
                								<div>
                									<Link to="/layoutB" onClick={() => $("#close").click()}>- Layout B</Link>
                								</div>
                								<div>
                									<Link to="/layoutC" onClick={() => $("#close").click()}>- Layout C</Link>
                								</div>
                								<div>
                									<Link to="/layoutD" onClick={() => $("#close").click()}>- Layout D</Link>
                								</div>
                							</div>
                						</div>

                						<div className="panel panel-default">
                							<div className="panel-heading">
                								<span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                								&nbsp;Component
                							</div>
                							<div className="panel-body">
                								<div>
                									- Grid
                								</div>
                								<div>
                									- Tree
                								</div>
                								<div>
                									- Chart
                								</div>
                							</div>
                						</div>
                					</div>
                					<div className="col-sm-4 col-lg-4">
                						<div className="panel panel-default">
                							<div className="panel-heading">
                								<span className="glyphicon glyphicon-align-left" aria-hidden="true"></span>
                								&nbsp;Pages
                							</div>
                							<div className="panel-body">
                								<div>
                									<Link to="/notice" onClick={() => $("#close").click()}>공지사항(C타입-현재)</Link>
                								</div>
                								<div>
                									<Link to="/noticeA" onClick={() => $("#close").click()}>공지사항(A타입-디테일)</Link>
                								</div>
                								<div>
                									<Link to="/noticeB" onClick={() => $("#close").click()}>공지사항(A타입-팝업)</Link>
                								</div>
                                                <div>
                									<Link to={{ pathname: '/tabs', query: { id: "assetTab", title: "운영자산관리", component: "Asset" } }} onClick={() => $("#close").click()}>Tab 예제(자산)</Link>
                								</div>
                                                <div>
                									<Link to="/forms" onClick={() => $("#close").click()}>폼 예제</Link>
                								</div>
                							</div>
                						</div>
                					</div>
                					<div className="col-sm-4 col-lg-4">
                                        <div className="panel panel-default">
                							<div className="panel-heading">
                								<span className="glyphicon glyphicon-signal" aria-hidden="true"></span>
                								&nbsp;Messages(i18n)
                							</div>
                							<div className="panel-body">
                								<div>
                									메시지(리소스): {NConstraint.MESSAGE('res.common.list')}
                								</div>
                							</div>
                						</div>
                					</div>
                				</div>
                			</div>
                			<div className="modal-footer">
                				<button id="close" type="button" className="btn btn-default" data-dismiss="modal">닫 기</button>
                			</div>
                		</div>
                	</div>
                </div>
                <div id="custom_page-wrapper">
                    {this.props.children}
                </div>
                <span id="notification"></span>
            </div>
        );
    }
}

App.propTypes = {
    app: PropTypes.object,
    children: PropTypes.any
};

App.defaultProps = {
    app: {
        notification: null
    }
};

App.childContextTypes = {
    children: PropTypes.any,
    notification: React.PropTypes.object
};

ReactDom.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/layoutA" component={LayoutAExample} />
            <Route path="/layoutB" component={LayoutBExample}/>
            <Route path="/layoutC" component={LayoutCExample}/>
            <Route path="/layoutD" component={LayoutDExample}/>
            <Route path="/notice" component={NoticeExample}/>
            <Route path="/noticeA" component={NoticeExampleA}/>
            <Route path="/noticeFormExampleA" component={NoticeFormExampleA}/>
            <Route path="/noticeB" component={NoticeExampleB}/>
            <Route path="/tabs" component={TabsExample}/>
            <Route path="/forms" component={FormExample}/>
        </Route>
    </Router>
), document.getElementById('app'));
