define("hioogo/0.1.0/controller/login", [ "md5/1.0.0/md5", "../config", "../common", "bootstrap/2.3.2/bootstrap", "events/1.1.0/events", "validator/1.2.0/validator" ], function(require, exports, module) {
    var md5 = require("md5/1.0.0/md5"), Config = require("../config"), common = require("../common");
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