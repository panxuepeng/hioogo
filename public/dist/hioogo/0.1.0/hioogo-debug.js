/* 2013-10-03 */
// 用来处理公共区域的操作，比如页头部分
define("hioogo/0.1.0/common-debug", [ "./config-debug", "bootstrap/2.3.2/bootstrap-debug" ], function(require, exports, module) {
    var Config = require("./config-debug"), bootstrap = require("bootstrap/2.3.2/bootstrap-debug");
    // 页面首次加载时都会执行一次
    function init() {
        $.getJSON(Config.serverLink("user"), function(result) {
            exports.checkLogin(result);
        });
        $("#logout").on("click", function() {
            $.getJSON(Config.serverLink("logout"), function(result) {
                exports.checkLogin(result);
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
            $("#login").fadeOut(100, function() {
                setTimeout(function() {
                    $("#post").show();
                }, 200);
            });
        } else {
            // 未登录状态
            $("#login").show();
            $("#post").hide();
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
        var s = '<p>&copy;2013 <a href="/?about">关于看自然</a> Powered by KanZiRan</p>' + "<p>Thanks " + '<a href="http://twitter.github.com/bootstrap/" target="_blank" title="基于HTML，CSS，JAVASCRIPT的简洁灵活的前端框架及交互组件集">Bootstrap</a>' + '<a href="http://jquery.com/" target="_blank" title="一个优秀的JavaScrīpt框架。使用户能更方便地处理HTML documents、events、实现动画效果，并且方便地为网站提供AJAX交互">jQuery</a>' + '<a href="http://www.laravel.com/" target="_blank" title="Laravel是一款人性化的PHP Web框架，推荐！。">Laravel</a>' + '<a href="http://seajs.org/" target="_blank" title="SeaJS 是一个适用于 Web 端的模块加载器">SeaJS</a>' + '<a href="http://www.plupload.com/" target="_blank" title="一款基于 Flash、HTML5 的文件上传工具，其最大的特点是，在浏览器端压缩图片后会保留照片的Exif信息">Plupload</a>' + '<a href="https://github.com/aui/artTemplate" target="_blank" title="一款性能卓越的 javascript 模板引擎">artTemplate</a>' + "</p>";
        return s;
    }
});
define("hioogo/0.1.0/config-debug", [], function(require, exports, module) {
    var basePath = "http://localhost:8080/";
    exports.version = "0.1.0";
    exports.base = basePath;
    exports.cache = {
        reset: function() {
            this.topic = {};
            this.topiclist = {};
        },
        topic: {},
        // 主题缓存
        topiclist: {}
    };
    // 是否登录
    exports.logined = false;
    // 图片播放器
    exports.player = "default.player";
    // 默认首页
    exports.index = "photolist";
    // 当前的action
    exports.action = "photolist";
    // 时间戳
    exports.timestamp = +new Date();
    // 公共js
    exports.commonScript = [];
    // 页面资源
    // 1: 普通页面
    // 2: 需检查登录状态的页面
    exports.pages = {
        photo: 1,
        photolist: 1,
        login: 1,
        post: 2
    };
    // 页面js版本号
    exports.actionVersion = {};
    // 页面模板版本号
    exports.tmplVersion = {};
    exports.go = function(url) {
        location = url;
    };
    exports.home = function(name) {
        return "/#/photolist";
    };
    exports.hashLink = function(name) {
        return "/#/" + name;
    };
    exports.link = function(name) {
        return "/#/" + name;
    };
    exports.serverLink = function(path) {
        return "/" + path;
    };
    exports.getTmplPath = function(name) {
        var v = exports.tmplVersion;
        var url = basePath + "/tmpl/" + name + ".html".replace(/[\/]+/g, "/");
        if (seajs.debug) {
            url += "?" + new Date();
        } else if (v[name]) {
            url += "?" + v[name];
        }
        return url;
    };
});
define("hioogo/0.1.0/default.player-debug", [ "./common-debug", "./config-debug", "bootstrap/2.3.2/bootstrap-debug" ], function(require, exports, module) {
    var common = require("./common-debug"), photoCache = {}, currentIndex = 0, photoCount = 0, ismoving = 0, dom = $(document), win = $(window), current;
    // 关闭大图
    dom.on("click", "#player-close", function() {
        $("body").css("overflow", "visible");
        $("#player").addClass("hide");
        current = null;
        dom.off("mousewheel.bigphoto");
        $("#player .photo").stop().stop().stop();
    });
    // 上一张
    dom.on("click", "#player-prev", function() {
        exports.prev();
    });
    // 下一张
    dom.on("click", "#player-next", function() {
        exports.next();
    });
    // 点击小图，打开大图
    dom.on("click", "img[name=photoview]", function() {
        currentIndex = parseInt($(this).attr("index"), 10);
        $("body").css({
            overflow: "hidden"
        });
        // 使用 setTimeout 是为了避免 body 的overflow:hidden 属性失效
        setTimeout(function() {
            play(currentIndex);
        }, 0);
    });
    // 点击页面停止图片自动滚动
    dom.on("click", "#player", function() {
        $("#player .photo").stop().stop().stop();
        ismoving = false;
    });
    win.resize(function() {
        resize();
    });
    win.keydown(function(event) {
        var keyCode = event.keyCode;
        // LEFT 37, RIGHT 39; UP 38, DOWN 40
        switch (keyCode) {
          case 37:
            exports.prev();
            break;

          case 39:
            exports.next();
            break;

          case 38:
            exports.up();
            break;

          case 40:
            exports.down();
            break;

          case 27:
            exports.close();
            break;
        }
    });
    exports.close = function() {
        $("#player").addClass("hide");
    };
    exports.init = function() {
        resize();
        photoCount = $("img[name=photoview]").size();
    };
    exports.prev = function() {
        $("#player .photo").stop().stop().stop();
        currentIndex -= 1;
        if (currentIndex < 0) {
            currentIndex = 0;
            common.dialog({
                content: "已经是第一张照片了"
            });
        } else {
            play(currentIndex);
        }
    };
    exports.next = function() {
        $("#player .photo").stop().stop().stop();
        currentIndex += 1;
        if (currentIndex < photoCount) {
            play(currentIndex);
        } else {
            common.dialog({
                content: "已经是最后一张照片了"
            });
        }
    };
    exports.up = function() {
        onmousewheel(10);
    };
    exports.down = function() {
        onmousewheel(-10);
    };
    function resize() {
        $("#player .photo").height(win.height() - 20);
    }
    // 打开大图
    function play(index) {
        var img = $("#photo-" + index), src = img.attr("src").replace("/270/", "/970/");
        var o = $("#player-photo"), height = o.height(), description = img.attr("description") || '<span style="color:#eeeeef;">暂无照片描述</span>';
        o.css({
            "background-position-y": 0
        });
        current = null;
        dom.off("mousewheel.bigphoto");
        $("#player").removeClass("hide");
        $("#player-desc").html("<h4>" + $("#topic-title").text() + "</h4>" + description);
        $("#player-shooting-time").html(img.attr("shooting_time"));
        if (photoCache[src]) {
            var _img = photoCache[src];
            dom.on("mousewheel.bigphoto", function(e) {
                //console.log(e.originalEvent.wheelDelta);
                // 向上滚动大于0
                // 向下滚动小于0
                onmousewheel(e.originalEvent.wheelDelta);
            });
            o.css("background-image", "url(" + src + ")");
            if (_img.height > height + 100) {
                ismoving = true;
                var offset = (height - _img.height) / 2;
                o.animate({
                    "background-position-y": offset
                }, 3e3, function() {
                    current = _img;
                    ismoving = false;
                });
            }
        } else {
            var img = new Image();
            img.index = index;
            img.onload = function() {
                // 图片加载完成之后，如用户没有切换其他图片，则正常显示
                if (currentIndex === img.index) {
                    current = {
                        height: img.height,
                        width: img.width
                    };
                    dom.on("mousewheel.bigphoto", function(e) {
                        //console.log(e.originalEvent.wheelDelta);
                        // 向上滚动大于0
                        // 向下滚动小于0
                        onmousewheel(e.originalEvent.wheelDelta);
                    });
                    o.css("background-image", "url(" + src + ")");
                    // 当图片比较高的情况下，自动将图片滚动到中间的位置
                    if (img.height > height + 100) {
                        var offset = (height - img.height) / 2;
                        ismoving = true;
                        o.animate({
                            "background-position-y": offset
                        }, 3e3, function() {
                            ismoving = false;
                        });
                    }
                }
                photoCache[src] = {
                    height: img.height,
                    width: img.width
                };
                img = null;
            };
            img.src = src;
        }
    }
    // 鼠标滚轮滚动时，上下滑动图像
    // backgroundPosition/backgroundPositionY 的浏览器兼容问题比较多
    // 上下滚动效果有背景偏移最好改用scrollTop
    // 向上滚动大于0
    // 向下滚动小于0
    function onmousewheel(wheelDelta) {
        if (!ismoving) {
            var o = $("#player .photo"), height = o.height(), step = 60;
            var posy = parseInt(o.css("backgroundPositionY") || 0, 10);
            // ie9下得不到正确的背景偏移（backgroundPositionY），ie7/8可以正确获取，Y?
            // 但是可以得到backgroundPosition
            if (!posy) {
                // 暂时处理ie9下得不到backgroundPositionY的问题
                posy = parseInt(o.css("backgroundPosition").split(" ")[1], 10);
            }
            //console.log(o.css('backgroundPosition'));
            if (wheelDelta > 0) {
                posy -= step;
            } else {
                posy += step;
            }
            if (posy > height) {
                posy = height;
            } else if (posy < -current.height) {
                posy = -current.height;
            }
            o.css({
                backgroundPositionY: posy
            });
        }
        // return false 以阻止页面滚动
        return false;
    }
});
define("hioogo/0.1.0/hioogo-debug", [ "./router-debug", "./config-debug", "./common-debug", "bootstrap/2.3.2/bootstrap-debug" ], function(require, exports) {
    var router = require("./router-debug");
});
define("hioogo/0.1.0/login-debug", [ "md5/1.0.0/md5-debug", "./config-debug", "./common-debug", "bootstrap/2.3.2/bootstrap-debug" ], function(require, exports, module) {
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
define("hioogo/0.1.0/photo-debug", [ "./config-debug", "./common-debug", "bootstrap/2.3.2/bootstrap-debug", "arttemplate/2.0.1/arttemplate-debug" ], function(require, exports, module) {
    var Config = require("./config-debug"), common = require("./common-debug"), photoPlayer = null, template = require("arttemplate/2.0.1/arttemplate-debug"), currentTopicid = "", dom = $(document);
    require.async("./" + Config.player, function(player) {
        photoPlayer = player;
    });
    exports.show = function(id) {
        id = id || 1;
        currentTopicid = id;
        if (Config.cache.topic[id]) {
            initData(Config.cache.topic[id]);
        } else {
            $.getJSON(Config.serverLink("topics/" + id), function(data) {
                if (data[0] === 200) {
                    initData(data[1]);
                    Config.cache.topic[currentTopicid] = data[1];
                } else {
                    seajs.log(data);
                }
            });
        }
    };
    // 编辑图片描述
    exports["on-photoedit"] = function($el) {
        var html = template.render("tmpl-photo-edit", getEditTmplData($el));
        common.dialog({
            title: "编辑照片描述",
            width: 600,
            content: html,
            onshown: function(dialog) {
                // 在弹出显示时
                // 如果文本框是空的，将光标定位到文本框
                var o = dialog.find("textarea");
                if (!$.trim(o.val())) o.focus();
            },
            onok: function(dialog) {
                postPhotoDesc(dialog);
            }
        });
    };
    // 编辑主题
    exports["on-topicedit"] = function() {
        location = "/#/post/" + currentTopicid;
    };
    // 删除主题
    exports["on-topicremove"] = function(o) {
        if (confirm("确认删除此主题和其所有照片吗？")) {
            var url = Config.serverLink("topics/" + currentTopicid);
            $.ajax({
                type: "DELETE",
                dateType: "json",
                url: url
            }).success(function(result) {
                if (result[0] === 200) {
                    // 删除主题的缓存信息
                    Config.cache.topic[currentTopicid] = null;
                    Config.go(Config.home());
                } else {
                    alert(result[1]);
                }
            }).error(function(xhr, status) {
                alert("出现错误，请稍候再试。");
            });
        }
    };
    // 推荐主题
    exports["on-topicrecommend"] = function(o) {
        var url = Config.serverLink("topics/" + currentTopicid);
        $.ajax({
            type: "PUT",
            dateType: "json",
            url: url
        }).success(function(result) {
            if (result[0] === 200) {} else {
                alert(result[1]);
            }
        }).error(function(xhr, status) {
            alert("出现错误，请稍候再试。");
        });
    };
    // 删除照片
    exports["on-photoremove"] = function(o) {
        if (confirm("确认彻底删除此照片吗？")) {
            var photo = o.closest("li[id^=photo]");
            photo.hide();
            var url = Config.serverLink("photos/" + o.attr("photoid"));
            $.ajax({
                type: "DELETE",
                dateType: "json",
                url: url
            }).success(function(result) {
                if (result[0] === 200) {} else {
                    alert(result[1]);
                    photo.show();
                }
            }).error(function(xhr, status) {
                alert("出现错误，请稍候再试。");
                photo.show();
            });
        }
    };
    exports.init = function(id) {
        // init ...
        // [显示/隐藏]编辑按钮
        dom.on("mouseover.photo", ".thumbnail", function() {
            $(this).find(".photo_edit").show();
        }).on("mouseleave.photo", ".thumbnail", function() {
            $(this).find(".photo_edit").hide();
        });
        common.lazyload();
    };
    function initData(data) {
        var html = "";
        if (data && typeof data === "object") {
            html = template.render("tmpl-photoview", data);
        }
        $("#photoview").html(html);
        setTimeout(function() {
            photoPlayer.init();
        }, 0);
    }
    function getEditTmplData(btn) {
        var img = btn.closest(".thumbnail").find("img"), src = img.attr("src"), photoid = img.attr("photoid"), shooting_time = img.attr("shooting_time"), description = img.attr("description");
        return {
            photosrc: src,
            topicid: currentTopicid,
            photoid: photoid,
            shooting_time: shooting_time,
            description: description
        };
    }
    // 提交照片描述
    function postPhotoDesc(dialog) {
        var data = dialog.find("form").serialize();
        var photoid = dialog.find(":hidden[name=photoid]").val();
        var url = Config.serverLink("photos/" + photoid);
        $.ajax({
            type: "PUT",
            data: data,
            dateType: "json",
            url: url
        }).success(function(result) {
            if (result[0] === 200) {
                var description = dialog.find("textarea").val();
                // 将编辑后的描述信息，写到照片属性上
                $("img[photoid=" + photoid + "]").attr("description", description);
                $("#description-" + photoid).text(description);
                // 关闭窗口
                common.dialog.close();
            } else {
                alert(result[1]);
            }
        }).error(function(xhr, status) {
            alert("出现错误，请稍候再试。");
        });
    }
    // 删除照片
    function remove(action, photoid) {
        action = action || "remove-photo";
        photoid = photoid || 0;
        var data = {
            action: action,
            topicid: currentTopicid,
            photoid: photoid
        };
        $.post(Config.serverLink("photo/remove"), data, function(result) {
            if (result[0] === 200) {} else {
                $("#photo-" + photoid).show();
            }
        }, "json").error(function(xhr, status) {
            $("#photo-" + photoid).show();
        });
    }
});
define("hioogo/0.1.0/photolist-debug", [ "./config-debug", "arttemplate/2.0.1/arttemplate-debug" ], function(require, exports, module) {
    var Config = require("./config-debug"), template = require("arttemplate/2.0.1/arttemplate-debug");
    exports.tmpl = "photolist";
    exports.show = function() {
        if (Config.cache.topiclist["news"]) {
            initData(Config.cache.topiclist["news"]);
        } else {
            $.getJSON(Config.serverLink("topics"), function(result) {
                if ($.isArray(result) && result[0] === 200) {
                    var data = {
                        list: result[1]
                    };
                    initData(data);
                    Config.cache.topiclist["news"] = data;
                } else {
                    seajs.log(result);
                }
            });
        }
    };
    function initData(data) {
        var html = "";
        html = template.render("tmpl-photolist", data);
        $("#photolist").html(html);
        if (data.pageCount) {
            $("#pagination").pagination(data.topicCount, {
                items_per_page: 12,
                num_display_entries: 10,
                current_page: 0,
                num_edge_entries: 1,
                link_to: "javascript:void(0)",
                prev_text: "上一页",
                next_text: "下一页",
                ellipse_text: "...",
                prev_show_always: true,
                next_show_always: true,
                callback: function(page, component) {
                    location = Config.link("photolist/" + page);
                }
            }).show();
        }
    }
    exports.init = function() {};
    // 获取主题封面照片
    function getPhotos() {}
});
define("hioogo/0.1.0/post-debug", [ "plupload/1.5.6/plupload-debug", "./common-debug", "./config-debug", "bootstrap/2.3.2/bootstrap-debug" ], function(require, exports, module) {
    require("plupload/1.5.6/plupload-debug");
    var uploader, common = require("./common-debug"), Config = require("./config-debug");
    exports.show = function(id) {
        var postForm = $("form[name=post]");
        if (id) {
            // 从浏览页点击编辑按钮过来
            postForm.find("legend").text("编辑照片主题");
            if (Config.cache.topic[id]) {
                initData(Config.cache.topic[id]);
            } else {
                // 刷新页面操作
                $.getJSON(Config.serverLink("topics/" + id), function(data) {
                    if (data[0] === 200) {
                        if (data[1].isauthor) {
                            initData(data[1]);
                        } else {
                            location = "/#/post";
                        }
                    } else {
                        seajs.log(data);
                    }
                });
            }
        } else {
            postForm.find("legend").text("创建照片主题");
            Form.reset();
        }
    };
    function initData(topic) {
        var postForm = $("form[name=post]");
        postForm.find("input[name=topicid]").val(topic._id);
        postForm.find("input[name=title]").val(topic.title);
        postForm.find("textarea[name=description]").val(topic.description);
        var html = [], photos = topic.photos;
        for (var i = 0, len = photos.length; i < len; i++) {
            var photo = photos[i];
            html.push('<div class="span2"><img src="' + photo.url + '" photo_id="' + photo._id + '"/></div>');
        }
        $("#uploadlist").html(html.join(""));
        $("#post-submit").attr({
            disabled: false,
            title: ""
        });
    }
    exports.init = function() {
        if (!uploader) {
            UploadPhoto.init();
        }
        Form.init();
    };
    var Form = {
        // 初始化上传表单
        init: function() {
            var self = this;
            $("form[name=post]").on("submit", function() {
                var form = $(this), data = {};
                if (self.check(form)) {
                    data.topicid = $.trim(form.find("input[name=topicid]").val());
                    data.title = $.trim(form.find("input[name=title]").val());
                    data.description = $.trim(form.find("textarea[name=description]").val());
                    data.photoList = [];
                    $("img[photo_id]").each(function() {
                        data.photoList.push($(this).attr("photo_id"));
                    });
                    data.cover_photo = $("#uploadlist img").eq(0).attr("src");
                    /*
					$.post(Config.serverLink('topics'), data, function( result ){
						if( result[0] === 200 ){
							var topicid = result[1].topicid;
							self.success(topicid);
							
							// 删除主题的缓存信息
							Config.cache.topic[topicid] = null;
						}else{
							self.error(result[1]);
						}
					}, 'json').error(function(xhr, status){
						alert('出现错误，请稍候再试。');
					});
					*/
                    var type = "POST", url = Config.serverLink("topics");
                    // 修改需用 PUT 方式提交数据
                    if (data.topicid) {
                        type = "PUT";
                        url = Config.serverLink("topics/" + data.topicid);
                    }
                    $.ajax({
                        type: type,
                        dateType: "json",
                        url: url,
                        data: data
                    }).success(function(result) {
                        if (result[0] === 200) {
                            var topicid = result[1].topicid;
                            self.success(topicid);
                            // 删除主题的缓存信息
                            Config.cache.topic[topicid] = null;
                        } else {
                            self.error(result[1]);
                        }
                    }).error(function(xhr, status) {
                        alert("出现错误，请稍候再试。");
                    });
                }
                return false;
            });
            $("button[name=post-reset]").on("click", function() {
                location = "/#/post";
                Form.reset();
            });
        },
        check: function(form) {
            if (!$.trim(form.find(":text[name=title]").val())) {
                alert("请输入标题");
                form.find(":text[name=title]").focus();
                return false;
            }
            if (!$("#uploadlist img").length) {
                alert("还没有上传任何图片");
                return false;
            }
            return true;
        },
        // 提交成功
        success: function(topicid) {
            $("#post-submit").attr({
                disabled: true,
                title: ""
            }).text("提交成功！再次选择照片后，可以继续提交");
            // 将返回的主题id赋值到表单项上
            // 再次提交将自动转为修改
            $("form[name=post]").find("input[name=topicid]").val(topicid);
            var $success = $("#post-success");
            $success.find("a[name=view]").attr("href", "#/photo/" + topicid);
            $success.show();
            Confirm.clear();
        },
        error: function(info) {
            if (typeof info === "string") {
                common.alert("<p>" + info + "</p>");
            } else if (typeof info === "object") {}
        },
        // 继续上传
        reset: function() {
            Confirm.clear();
            $("form[name=post]")[0].reset();
            // form.reset 貌似不能充值隐藏表单项的值
            // 手动清除
            $("form[name=post]").find("input[name=topicid]").val("");
            $("#filelist").empty();
            $("#uploadlist").empty();
            uploader && uploader.splice(0, uploader.files.length);
            $("#post-submit").attr({
                disabled: true,
                title: "请选择照片……"
            }).text("提 交");
            $("#post-success").hide();
        }
    };
    // 重置上传表单
    $("button[name=post-reset]").on("click", function() {
        Form.reset();
        return false;
    });
    var UploadPhoto = {
        // 初始化上传
        init: function() {
            var self = this;
            // http://www.plupload.com/plupload/docs/api/index.html
            uploader = new plupload.Uploader({
                // 2013-02-08 12:46 潘雪鹏
                // 注 意：
                // 1、优先使用 flash 在客户端进行图片压缩
                // 2、plupload的html5实现方式（目前）比较耗内存，且压缩完毕之后不能及时释放内存
                // 3、plupload的flash实现方式较节省内存，且可及时释放占用的内存
                // 4、html5方式作为备用还可
                // 例 如：
                // 选择10张照片，每张5mb左右，上传之前chrome使用是60mb内存左右，
                // 上传过程当中
                // flash: 峰值达到200mb左右，完成之后回落到90mb
                // html5: 峰值不断攀升，达到400mb左右，完成之后回落到315mb
                runtimes: "flash, html5",
                file_data_name: "photo",
                browse_button: "pickfiles",
                url: Config.serverLink("photos"),
                flash_swf_url: "dist/plupload/1.5.6/plupload.flash.swf",
                filters: [ {
                    title: "Image files",
                    extensions: "jpg"
                } ],
                max_file_size: "10mb",
                //resize : {width : 1600, height : 1600, quality : 95}
                resize: {
                    width: 1e3,
                    height: 1e3,
                    quality: 95
                }
            });
            uploader.bind("Init", function(up, params) {
                $("#filelist").html("");
            });
            uploader.init();
            uploader.bind("FilesAdded", function(up, files) {
                self.selected(files);
                // 选择照片后自动开始上传
                uploader.start();
                up.refresh();
                Confirm.set();
            });
            // 单张照片的上传进度
            uploader.bind("UploadProgress", function(up, file) {
                self.progress(file);
            });
            // 一张照片上传成功
            uploader.bind("FileUploaded", function(up, file, data) {
                self.uploadedOne(file, data);
            });
            // 所有照片上传完成事件
            uploader.bind("UploadComplete", function(up, files) {
                self.complete(files);
            });
        },
        selected: function(files) {
            $("#post-success").hide();
            $("#post-submit").attr({
                disabled: true,
                title: ""
            }).text("正在上传图片，暂时不能提交");
            $("#filelist").html(" 选择了 <b>" + files.length + '</b> 张图片，正在上传第 <b id="FileUploaded">0</b> 张，进度 <b id="UploadProgress">0</b>%');
        },
        // 上传进度
        progress: function(file) {
            $("#UploadProgress").html(file.percent);
        },
        // 一张照片上传成功后
        uploadedOne: function(file, data) {
            var o = $("#FileUploaded"), index = parseInt(o.text(), 10) + 1;
            o.text(index);
            var r = $.parseJSON(data.response);
            $("#uploadlist").append('<div class="span2"><img src="' + r.url + '" photo_id="' + r.id + '"/></div>');
        },
        // 所有照片上传完成
        complete: function(files) {
            $("#filelist").html(" 已上传 <b>" + files.length + "</b> 张图片");
            $("#post-submit").attr({
                disabled: false,
                title: ""
            }).text(" 提 交 ");
        }
    };
    var Confirm = {
        //设置离开提示
        set: function(msg) {
            msg = msg || "确定要离开吗？";
            //如果已经绑定了 onbeforeunload 事件则不再绑定
            if (typeof window.onbeforeunload == "function") {
                return false;
            }
            window.onbeforeunload = function(event) {
                event = event || window.event;
                event.returnValue = msg;
                //Chrome 必须下面这样才有效，上面的对 IE Firefox 同样有效
                //但是这个对IE、Firefox同样有效，顾取消上面的代码
                return msg;
            };
            return true;
        },
        //清除离开提示
        clear: function() {
            window.onbeforeunload = null;
        }
    };
});
define("hioogo/0.1.0/router-debug", [ "./config-debug", "./common-debug", "bootstrap/2.3.2/bootstrap-debug" ], function(require, exports, module) {
    var Config = require("./config-debug"), common = require("./common-debug"), Path = [], Params = {}, Actions = {}, $ = window.jQuery;
    // 加载一些普通的公共的 js 文件
    // 他们不是seajs模块，如 bootstrap.min.js 等
    getScript(Config.commonScript);
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
    //===========================================================================
    /**
	* 页面初始化
	*   下列情况下执行：
	*   1、页面首次加载后
	*   2、hashchange事件触发后
	*/
    function routerInit(callback) {
        var action = getAction();
        if (Actions[action]) {
            $("#container").children(":visible").hide();
            $("#row-" + action).show();
            $.isFunction(Actions[action].show) && Actions[action].show(Path[1]);
        } else {
            seajs.use("./dist/hioogo/" + Config.version + "/" + action, function(o) {
                $.get(Config.getTmplPath(o.tmpl || action), function(tmpl) {
                    $("#container").children(":visible").hide();
                    $("#container").append(tmpl);
                    $.isFunction(o.init) && o.init(Path[1]);
                    $.isFunction(o.show) && o.show(Path[1]);
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
        Config.action = action;
        return action;
    }
    /**
	* 加载普通公共js
	* 
	*/
    function getScript(arr) {
        for (var i = 0, length = arr.length; i < length; i += 1) {
            $.ajax({
                url: arr[i],
                dataType: "script",
                cache: "true"
            });
        }
    }
});