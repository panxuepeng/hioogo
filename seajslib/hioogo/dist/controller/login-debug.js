define("hioogo/0.1.0/controller/login-debug", [ "md5/1.0.0/md5-debug", "../config-debug", "../common-debug", "bootstrap/2.3.2/bootstrap-debug", "events/1.1.0/events-debug" ], function(require, exports, module) {
    var md5 = require("md5/1.0.0/md5-debug"), Config = require("../config-debug"), common = require("../common-debug");
    exports.show = function() {};
    exports.submit = function(form) {
        var data, password = form.find(":password[name=password]"), pwd = $.trim(password.val());
        password.val(md5(pwd));
        data = form.serialize();
        password.val(pwd);
        $.post(Config.serverLink("login"), data, function(result) {
            if (result[0] === 200) {
                location = Config.home();
                common.checkLogin(result);
            } else {
                alert(result[1]);
            }
        }, "json").error(function(xhr, status) {
            alert(status);
        });
    };
    exports.init = function() {};
});