class NConstraint{
  constructor() {}

  static get SERVER() {
     return "http://localhost:8090";
  }

  static get PRODUCT() {
     return "ITSM";
  }

  static get DEFAULT_OPTION_NAME() {
     return "name";
  }

  static get DEFAULT_OPTION_VALUE() {
     return "value";
  }

  static MESSAGE(key, args0, args1){
    let message;
    if(localStorage[key] && typeof args0 == "undefined"){
      return localStorage[key];
    }else{
      let msgProp = {
        m_key: key
      };
      $.ajax({ type:"POST",
        url: NConstraint.SERVER + "/itg/base/getMessage.do",
        contentType: "application/json",
        dataType: "json",
        async: false,
        data : JSON.stringify(msgProp),
        success:function(data){
  				message = data['returnMessage'];
        	if(message != null && message != "") {
  					if(message.indexOf("\\n") > -1) {
  						message = ( message.split("\\n").join("\n") );
  					}
  				}
          if(typeof args0 == "undefined"){
            localStorage[key] = message;
          }
  			}
  		});
    }
    return message;
  }
}
export default NConstraint;
