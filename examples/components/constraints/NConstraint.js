class NConstraint {
    constructor() {}

    // 서버 HOST 파일
    static get HOST() {
        return "http://192.168.233.22:8082";
    }

    static get GRID_LIST_FIELD() {
        return "gridVO.rows";
    }

    static get DEFAULT_OPTION_NAME() {
        return "CODE_TEXT";
    }

    static get DEFAULT_OPTION_VALUE() {
        return "CODE_ID";
    }

    static MESSAGE(key, args0, args1) {
        let message;
        if (localStorage[key] && typeof args0 == "undefined") {
            return localStorage[key];
        } else {
            let msgProp = {
                m_key: key
            };
            $.ajax({
                type: "POST",
                url: NConstraint.HOST + "/itg/base/getMessage.do",
                contentType: "application/json",
                dataType: "json",
                async: false,
                data: JSON.stringify(msgProp),
                success: function(data) {
                    message = data.returnMessage;
                    if (message !== null && message !== "") {
                        if (message.indexOf("\\n") > -1) {
                            message = (message.split("\\n").join("\n"));
                        }
                    }
                    if (typeof args0 == "undefined") {
                        localStorage[key] = message;
                    }
                }
            });
        }
        return message;
    }
}
export default NConstraint;
