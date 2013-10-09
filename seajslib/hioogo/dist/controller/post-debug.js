define("hioogo/0.1.0/controller/post-debug", [ "plupload/1.5.6/plupload-debug", "../common-debug", "../config-debug", "bootstrap/2.3.2/bootstrap-debug", "events/1.1.0/events-debug" ], function(require, exports, module) {
    require("plupload/1.5.6/plupload-debug");
    var uploader, common = require("../common-debug"), Config = require("../config-debug");
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
							var topicid = result[1].topicid
							self.success(topicid)
							
							// 删除主题的缓存信息
							Config.cache.topic[topicid] = null
						}else{
							self.error(result[1])
						}
					}, 'json').error(function(xhr, status){
						alert('出现错误，请稍候再试。')
					})
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
            // 表单项变化时增加离开提示
            $(":input").on("change", function() {
                Confirm.set();
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
            msg = msg || "修改尚未保存，确定离开？";
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