class NControls{
  constructor() {}

  // Target(this), buttons[Array], hideButtons[Array]
  static convertButton(target, buttons, hideButtons) {
    console.info("버튼매퍼")

    let _this = target;
    buttons.some(function(button) {
      if(button.onClickEvent){
          button.onClick = _this[button.onClickEvent].bind(_this);
          button.visible = true;
      }

      if(hideButtons != null){
        hideButtons.some(function(hidButton) {
          if(button.id == hidButton){
            button.visible = false;
          }
        });
      }
    });
  }
}
export default NControls;
