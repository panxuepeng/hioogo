/**
 * hash 路由
 * 
 * 路由做的事情很简单：
 * 1、获取url（如 http://www.kanziran.cn/#/photo/6）当中 photo 字符串
 * 2、加载指定的文件photo.js（如 assets/js/action/photo.js）
 * 3、如果是第一次加载此文件，则同时加载photo.html模板
 * 4、加载模板完成后，执行photo.js的init和show方法
 * 5、如果，已经加载过js文件，则直接执行show方法
 * 6、另外，还加载一些公共的js文件
 * 7、注意：其他任何文件都不得require此文件
 * 
 * 2013-01-03 潘雪鹏
 */
define("hioogo/0.1.0/hioogo-debug", [ "./config-debug", "./common-debug", "bootstrap/2.3.2/bootstrap-debug", "events/1.1.0/events-debug", "validator/1.2.0/validator-debug" ], function(require, exports, module) {
    var Config = require("./config-debug"), common = require("./common-debug"), Path = [], Params = {}, Actions = {}, $ = window.jQuery;
    // 初始化成功之后，加载相关资源
    // 回调方法仅需执行一次
    routerInit(function() {
        common.init();
        setTimeout(function() {
            preload();
        }, 500);
    });
    // 绑定 hashchange 事件
    $(window).bind("hashchange", function() {
        routerInit();
    });
    // 响应 controller 事件
    $(document).delegate("[data-on]", "click", function() {
        var o = $(this), name = o.data("on");
        Actions[Config.action]["on-" + name](o);
    });
    // 响应 submit 事件
    $(document).delegate("form", "submit", function() {
        var o = $(this), submit = Actions[Config.action][o.data("submit") || "submit"];
        if (submit) {
            submit(o);
            return false;
        }
    });
    //===========================================================================
    /**
	* 页面初始化
	*   下列情况下执行：
	*   1、页面首次加载后
	*   2、hashchange事件触发后
	*/
    function routerInit(callback) {
        var action = getAction();
        Config.action = action;
        if (Actions[action]) {
            $("#container").children(":visible").hide();
            $("#row-" + action).show();
            $.isFunction(Actions[action].show) && Actions[action].show(Path[1]);
            $.isFunction(common.show) && common.show(Path[1]);
        } else {
            seajs.use("./dist/hioogo/" + Config.version + "/controller/" + action, function(o) {
                $.get(Config.getTmplPath(o.tmpl || action), function(tmpl) {
                    $("#container").children(":visible").hide();
                    $("#container").append(tmpl);
                    // init 方法仅首次加载时执行一次
                    $.isFunction(o.init) && o.init(Path[1]);
                    $.isFunction(o.show) && o.show(Path[1]);
                    $.isFunction(common.show) && common.show(Path[1]);
                });
                Actions[action] = o;
            });
        }
        $.isFunction(callback) && callback();
    }
    /**
	* App资源预加载，在初始化之后执行一次
	* 
	*/
    function preload() {
        var pages = Config.pages;
        // 预加载页面模板
        for (var name in pages) {
            if (name !== Config.action) {
                $.get(Config.getTmplPath(name));
            }
        }
    }
    /**
	* 获取 http://kanziran.com/#!/photolist/2?k1=val&k2=val2当中 /photolist/2 部分
	* 
	*/
    function getPath(path) {
        if (path.substr(0, 1) === "!") {
            path = path.slice(1);
        }
        if (path && path.substr(0, 1) === "/") {
            path = path.slice(1);
        }
        var arr = path.split("/");
        return arr;
    }
    /**
	* 获取 http://kanziran.com/#!/photo/2 当中的 photo 部分
	* 
	*/
    function getAction() {
        var $_GET, part, action, hash = location.hash.slice(1).replace("?", "&");
        if (hash) {
            $_GET = hash.split("&");
            Path = getPath($_GET[0]);
            action = Path[0];
            for (var i = 1, length = $_GET.length; i < length; i += 1) {
                part = $_GET[i].split("=");
                Params[part[0]] = part[1];
            }
        }
        // 如当前请求的action为空或者不在指定列表当中，则使用默认action
        if (!action || !Config.pages[action]) {
            action = Config.index;
        }
        return action;
    }
});