// 用来处理公共区域的操作，比如页头部分
define("hioogo/0.1.0/common", [ "./config", "bootstrap/2.3.2/bootstrap", "events/1.1.0/events" ], function(require, exports, module) {
    var Config = require("./config"), bootstrap = require("bootstrap/2.3.2/bootstrap"), Events = require("events/1.1.0/events");
    Events.mixTo(exports);
    // 页面首次加载时都会执行一次
    function init() {
        $.getJSON(Config.serverLink("user"), function(result) {
            exports.checkLogin(result);
        });
        $("#user-logout").on("click", function() {
            $.getJSON(Config.serverLink("logout"), function(result) {
                if (result[0] === 200) {
                    exports.checkLogin([ 0 ]);
                }
            });
            return false;
        });
        $("footer").html(getFooterHtml());
    }
    exports.init = init;
    // 检查登录状态
    exports.checkLogin = function(result) {
        var pages = Config.pages;
        if (result[0] === 200) {
            Config.logined = true;
            // 登录之后需要清除主题缓存
            Config.cache.reset();
            $("#user-login").fadeOut(100, function() {
                setTimeout(function() {
                    $("#create-topic").show();
                }, 200);
            });
        } else {
            // 未登录状态
            $("#user-login").show();
            $("#create-topic").hide();
            // 判断当前页面是否是受保护的页面
            // 如果是则跳转到首页
            for (var name in pages) {
                if (name === Config.action && pages[name] === 2) {
                    location = Config.home();
                }
            }
        }
    };
    // 弹窗
    exports.alert = function(content) {
        var $dialog = $("#dialog");
        $dialog.children(".modal-body").html(content);
        exports.dialog();
    };
    // 弹窗默认配置
    var defaults = {
        title: "提示",
        width: 560,
        content: "",
        backdrop: true,
        keyboard: true,
        show: true,
        onshown: null,
        onok: function() {
            exports.dialog.close();
        }
    };
    exports.dialog = function(option) {
        option = option || {};
        var dialog = $("#dialog");
        option = $.extend({}, defaults, option);
        dialog.width(option.width);
        dialog.find(".modal-header h3").html(option.title);
        dialog.find(".modal-body").html(option.content);
        dialog.modal(option);
        dialog.off("shown");
        $.isFunction(option.onshown) && dialog.on("shown", function() {
            option.onshown(dialog);
        });
        $.isFunction(option.onok) && dialog.find("a[name=onok]").off("click").on("click", function() {
            option.onok(dialog);
            return false;
        });
    };
    exports.dialog.close = function() {
        $("#dialog").modal("hide");
    };
    // 页面初始化事件
    exports.on("afterinit", function() {
        breadcrumb();
    });
    // 设置面包屑导航
    var breadcrumb = function() {
        var html, $title = $("#topic-title");
        if ($title.is(":visible")) {
            html = '<li><a href="#/photolist">最新照片</a></li>' + '<li class="active"><span class="divider">/</span> ' + $title.text() + "</li>";
        } else {
            html = "<li>最新照片</li>";
        }
        $("#breadcrumb").html(html);
    };
    // 延迟加载
    exports.lazyload = function() {
        var timeId;
        //event.namespace
        $(window).bind("scroll.lazyload resize.lazyload", function() {
            clearTimeout(timeId);
            timeId = setTimeout(function() {
                $("div[data-src], li[data-src], img[data-src]").each(function() {
                    var o = $(this);
                    if (isvisible(o)) {
                        if (o.is("img")) {
                            o.attr("src", o.attr("data-src"));
                        } else {
                            o.css("background-image", "url(" + o.attr("data-src") + ")");
                        }
                        o.removeAttr("data-src");
                    }
                });
            }, 200);
        });
    };
    // 是否处于可视区域
    function isvisible(jqObj) {
        var offset = Math.ceil(jqObj.height()), // 90%区域不可见时
        scrollTop = $(document).scrollTop(), minHeight = scrollTop - offset, maxHeight = scrollTop + $(window).height(), top = jqObj.offset().top;
        return top > minHeight && top < maxHeight;
    }
    function getFooterHtml() {
        var s = '<p>&copy;2013 <a href="/?about">关于看自然</a> Powered by KanZiRan</p>' + "<p>Thanks " + '<a href="http://twitter.github.com/bootstrap/" target="_blank" title="基于HTML，CSS，JAVASCRIPT的简洁灵活的前端框架及交互组件集">Bootstrap</a>' + '<a href="http://jquery.com/" target="_blank" title="一个优秀的JavaScrīpt框架。使用户能更方便地处理HTML documents、events、实现动画效果，并且方便地为网站提供AJAX交互">jQuery</a>' + '<a href="http://seajs.org/" target="_blank" title="SeaJS 是一个适用于 Web 端的模块加载器">SeaJS</a>' + '<a href="http://www.plupload.com/" target="_blank" title="一款基于 Flash、HTML5 的文件上传工具，其最大的特点是，在浏览器端压缩图片后会保留照片的Exif信息">Plupload</a>' + '<a href="https://github.com/aui/artTemplate" target="_blank" title="一款性能卓越的 javascript 模板引擎">artTemplate</a>' + "</p>";
        return s;
    }
});