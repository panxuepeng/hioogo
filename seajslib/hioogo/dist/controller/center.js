define("hioogo/0.1.0/controller/center", [ "md5/1.0.0/md5", "../config", "../common", "bootstrap/2.3.2/bootstrap", "events/1.1.0/events", "validator/1.2.0/validator" ], function(require, exports, module) {
    var md5 = require("md5/1.0.0/md5"), Config = require("../config"), common = require("../common"), md5 = require("md5/1.0.0/md5");
    require("validator/1.2.0/validator");
    exports.show = function(name) {
        name = name || "profile";
        $("#row-center form").hide();
        $("#center-" + name).show();
        $("#row-center .sidenav li.active").removeClass("active");
        $("#row-center .sidenav a[href*=" + name + "]").closest("li").addClass("active");
    };
    exports.init = function() {
        // 表单验证相关
        // 鼠标移入移出时增加删除classname"focus"
        $(".control-group").mouseenter(function() {
            var o = $(this);
            if (!o.hasClass("error")) o.addClass("focus");
        }).mouseleave(function() {
            $(this).removeClass("focus");
        });
        // 获取用户信息
        $.getJSON(Config.serverLink("user"), function(obj) {
            console.log(obj);
        });
        var submitting = false;
        // 个人信息
        $("#center-profile").validator({
            after: function() {
                if (submitting) return false;
                var arr = $(this).serializeArray();
                var data = {};
                $.each(arr, function(i, n) {
                    data[n.name] = n.value;
                });
                submitting = true;
                // console.log(data)
                submitProfile(data);
                return false;
            },
            errorCallback: function(els) {
                submitting = false;
                if (typeof console === "object") {
                    console.log("验证失败的表单：");
                    console.log(els);
                }
            }
        });
        function submitProfile(data) {
            $.ajax({
                url: Config.serverLink("center/profile"),
                type: "PUT",
                data: data,
                dataType: "json",
                success: function(result) {
                    var alert = $("#center-alert");
                    if (result[0] === 200) {
                        alert.removeClass("alert-error").addClass("alert-success");
                    } else {
                        alert.removeClass("alert-success").addClass("alert-error");
                    }
                    $("#center-msg").html(result[1]);
                    alert.show();
                },
                error: function() {
                    alert("提交失败，请稍候再试");
                },
                complete: function() {
                    submitting = false;
                }
            });
        }
        $("#center-password input").attr("required", "true").data("parent", ".control-group");
        // 修改密码
        $("#center-password").validator({
            after: function() {
                if (submitting) return false;
                var arr = $(this).serializeArray();
                var data = {};
                $.each(arr, function(i, n) {
                    data[n.name] = md5($.trim(n.value));
                });
                submitting = true;
                //console.log(data)
                submitPassword(data);
                return false;
            },
            errorCallback: function(els) {
                submitting = false;
                if (typeof console === "object") {
                    console.log("验证失败的表单：");
                    console.log(els);
                }
            }
        });
        function submitPassword(data) {
            $.ajax({
                url: Config.serverLink("center/password"),
                type: "PUT",
                data: data,
                dataType: "json",
                success: function(result) {
                    var alert = $("#center-alert");
                    if (result[0] === 200) {
                        alert.removeClass("alert-error").addClass("alert-success");
                    } else {
                        alert.removeClass("alert-success").addClass("alert-error");
                    }
                    $("#center-msg").html(result[1]);
                    alert.show();
                },
                error: function() {
                    alert("提交失败，请稍候再试");
                },
                complete: function() {
                    submitting = false;
                }
            });
        }
        // 安全问题
        $("#center-questions").validator({
            after: function() {
                if (submitting) return false;
                var data = $(this).serializeArray();
                submitting = true;
                // console.log(data)
                submitSecure(data);
                return false;
            },
            errorCallback: function(els) {
                submitting = false;
                if (typeof console === "object") {
                    console.log("验证失败的表单：");
                    console.log(els);
                }
            }
        });
        function submitSecure(data) {
            $.ajax({
                url: Config.serverLink("center/questions"),
                type: "PUT",
                data: data,
                dataType: "json",
                success: function(result) {
                    var alert = $("#center-alert");
                    if (result[0] === 200) {
                        alert.removeClass("alert-error").addClass("alert-success");
                    } else {
                        alert.removeClass("alert-success").addClass("alert-error");
                    }
                    $("#center-msg").html(result[1]);
                    alert.show();
                },
                error: function() {
                    alert("提交失败，请稍候再试");
                },
                complete: function() {
                    submitting = false;
                }
            });
        }
    };
});