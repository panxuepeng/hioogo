define("hioogo/0.1.0/login-debug", [ "md5/1.0.0/md5-debug", "./config-debug", "./common-debug" ], function(require, exports, module) {
    var md5 = require("md5/1.0.0/md5-debug"), Config = require("./config-debug"), common = require("./common-debug");
    exports.show = function() {};
    exports.init = function() {
        $("form[name=login]").on("submit", function() {
            var form = $(this), data, password = form.find(":password[name=password]"), pwd = password.val();
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
            return false;
        });
    };
});