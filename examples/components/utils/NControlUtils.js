class NControlUtils {
    constructor() {}

    // Target(this), buttons[Array], hideButtons[Array]
    static bindButtonEvent(target, buttons) {
        let _this = target;
        buttons.forEach(function(button) {
            if (button.onClickEvent) {
                button.onClick = _this[button.onClickEvent].bind(_this);
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
export default NControlUtils;
