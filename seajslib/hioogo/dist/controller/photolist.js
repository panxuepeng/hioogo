define("hioogo/0.1.0/controller/photolist", [ "../config", "arttemplate/2.0.1/arttemplate", "../common", "bootstrap/2.3.2/bootstrap", "events/1.1.0/events" ], function(require, exports, module) {
    var Config = require("../config"), template = require("arttemplate/2.0.1/arttemplate"), common = require("../common");
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
        common.trigger("afterinit");
    }
    exports.init = function() {};
    // 获取主题封面照片
    function getPhotos() {}
});