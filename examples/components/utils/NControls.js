class NControls {
    constructor() {}

    // Target(this), buttons[Array], hideButtons[Array]
    static bindButton(target, buttons, hideButtons) {
        let _this = target;
        buttons.forEach(function(button) {
            if (button.onClickEvent) {
                button.onClick = _this[button.onClickEvent].bind(_this);
                button.visible = true;
            }
            // Hide Button 제어
            if (hideButtons !== null) {
                hideButtons.some(function(hidButton) {
                    if (button.id == hidButton) {
                        button.visible = false;
                    }
                });
            }
        });
    }

    static bindEvent(target, prop, funcName, eventName) {
        let _this = target;
        prop[eventName] = _this[funcName].bind(_this);
    }

    static setVisible(props, targetIds, isVisible) {
        if (Array.isArray(props)) {
            targetIds.forEach(targetId => {
                props.some(prop => {
                    if (targetId === prop.id) {
                        prop.visible = isVisible;
                    }
                });
            });
        }
    }
}
export default NControls;
