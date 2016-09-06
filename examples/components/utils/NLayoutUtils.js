import React, {Component, PropTypes} from 'react';
import {Grid, Row, Col, Clearfix, ButtonToolbar, Button} from 'react-bootstrap';

import NGrid from '../grid/NGrid';
import NForm from '../forms/NForm';
import NTree from '../tree/NTree';

class NLayoutUtils {
    constructor() {}

    // Target(this), buttons[Array], hideButtons[Array]
    static ComponentRender(component) {
        let render;
        switch (component.type) {
            case "grid":
                render = (<NGrid ref={component.id} grid={component}/>);
                break;
            case "form":
                render = (<NForm ref={component.id} id={component.id} fieldSets={component.fieldSet}/>);
                break;
            case "tree":
                render = (<NTree ref={component.id} tree={component}/>);
                break;
            default:
        }
        return render;
    }

    static ButtonRender(buttons) {
        let render;
        if (buttons) {
            render = (buttons.map((button) => {
                if(!("visible" in button)){
                    button.visible = true;
                }
                if(button.visible)
                    return <Button key={button.id} onClick={button.onClick}>{button.label}</Button>;
                }
            ));
        }
        return render;
    }

    // 알림창 생성
    static Notification(id) {
        let notification = $("#"+id).kendoNotification({
            position: {
                pinned: true,
                top: 30,
                right: 30
            },
            //autoHideAfter: 0,
            stacking: "down",
            templates: [{
                type: "info",
                template: $("#emailTemplate").html()
            }, {
                type: "error",
                template: $("#errorTemplate").html()
            }, {
                type: "upload-success",
                template: $("#successTemplate").html()
            }]
        }).data("kendoNotification");
        return notification;
    }
}
export default NLayoutUtils;
