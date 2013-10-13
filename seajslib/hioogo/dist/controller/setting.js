define("hioogo/0.1.0/controller/setting", [ "md5/1.0.0/md5", "../config", "../common", "bootstrap/2.3.2/bootstrap", "events/1.1.0/events", "validator/1.2.0/validator", "arttemplate/2.0.1/arttemplate" ], function(require, exports, module) {
    var md5 = require("md5/1.0.0/md5"), Config = require("../config"), common = require("../common"), template = require("arttemplate/2.0.1/arttemplate");
    exports.show = function(name) {
        name = name || "profile";
        $("#row-setting form, #setting-alert").hide();
        var form = $("#setting-" + name);
        form.show();
        common.formData(form);
    };
    exports.init = function() {
        var html = template.render("tmpl-setting", {
            categorys: []
        });
        $("#setting").html(html);
        bind();
    };
    function bind() {
        $("#setting-website").submit(function() {
            var o = $(this);
            var data = o.serializeArray();
            $.ajax({
                url: Config.serverLink(o.attr("action")),
                type: "PUT",
                data: data,
                dataType: "json",
                success: function(result) {
                    if (result[0] === 200) {} else {}
                },
                error: function() {
                    alert("提交失败，请稍候再试");
                },
                complete: function() {
                    submitting = false;
                }
            });
            return false;
        });
    }
});