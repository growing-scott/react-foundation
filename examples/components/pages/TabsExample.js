import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NTabs from '../layout/NTabs';

import Asset from './Asset';
import AssetForm from './AssetForm';

class TabsExample extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            tabs: []
        };
        this.tabEventHandler = this.tabEventHandler.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        const {query} = this.props.location;

        if(query){
            this.setState(
                (state) => ({
                    tabs: state.tabs.concat(query)
                })
            );
        }

        this.props.links.Asset = (<Asset onEvent={this.tabEventHandler} />);

    }

    // 탭 이벤트 핸들러 전달
    tabEventHandler(dataSet){
        let tab = {
            id: "assetForm_" + dataSet.data.ASSET_ID,
            title: dataSet.data.CONF_NM,
            component: "AssetForm"
        };
        this.refs.tab.appendTab(tab);
    }

    render() {
        const tabs = this.state.tabs;
        return (
            <NTabs ref="tab" id="tabExample" tabs={tabs} tabActiveKey={this.props.location.query.id} links={this.props.links}  />
        );
    }
}

TabsExample.propTypes = {
	links: PropTypes.object
};

TabsExample.defaultProps = {
	links : {
		Asset: (<Asset/>),
		AssetForm: (<AssetForm/>)
	}
};

export default TabsExample;
