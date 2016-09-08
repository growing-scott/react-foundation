import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {Tabs, Tab} from 'react-bootstrap';

class NTabs extends Component {
    constructor() {
        super(...arguments);

        this.state = {
            tabs: [],
            tabActiveKey: null
        };

        this.onSelect = this.onSelect.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {
        if(this.props.tabs){
            this.setState({
                tabs: this.props.tabs
            });
        }

        if(this.props.tabActiveKey){
            this.setState({
                tabActiveKey: this.props.tabActiveKey
            });
        }
    }

    onSelect(selectedKey){
        this.setState((state) => ({ tabActiveKey: selectedKey }));
    }

    appendTab(newTab){
        let isExist = false;
        isExist = this.state.tabs.some(
            (tab) => {
                if(tab.id === newTab.id){
                    return true;
                }
            }
        );

        if(isExist){
            this.setState(
                (state) => ({
                    tabActiveKey: newTab.id
                })
            );
        }else{
            this.setState(
                (state) => ({
                    tabs: state.tabs.concat(newTab),
                    tabActiveKey: newTab.id
                })
            );
        }
    }

    render() {
        let tabs = this.state.tabs;

        return (
            <Tabs id={this.props.id} activeKey={this.state.tabActiveKey} onSelect={this.onSelect} animation={false}>
      			{tabs.map(
      				(tab) => <Tab key={tab.id} eventKey={tab.id} title={tab.title}>{this.props.links[tab.component]}</Tab>
      			)}
      		</Tabs>
        );
    }
}

export default NTabs;
