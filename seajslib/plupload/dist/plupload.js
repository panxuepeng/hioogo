/*
 * plupload
 * https://github.com/panxuepeng/plupload
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */
define("plupload/1.5.6/plupload", [], function(require, exports) {
    return plupload;
});

/*1.5.6*/
(function() {
    var f = 0, k = [], m = {}, i = {}, a = {
        "<": "lt",
        ">": "gt",
        "&": "amp",
        '"': "quot",
        "'": "#39"
    }, l = /[<>&\"\']/g, b, c = window.setTimeout, d = {}, e;
    function h() {
        this.returnValue = false;
    }
    function j() {
        this.cancelBubble = true;
    }
    (function(n) {
        var o = n.split(/,/), p, r, q;
        for (p = 0; p < o.length; p += 2) {
            q = o[p + 1].split(/ /);
            for (r = 0; r < q.length; r++) {
                i[q[r]] = o[p];
            }
        }
    })("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe");
    var g = {
        VERSION: "1.5.6",
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -601,
        IMAGE_FORMAT_ERROR: -700,
        IMAGE_MEMORY_ERROR: -701,
        IMAGE_DIMENSIONS_ERROR: -702,
        mimeTypes: i,
        ua: function() {
            var r = navigator, q = r.userAgent, s = r.vendor, o, n, p;
            o = /WebKit/.test(q);
            p = o && s.indexOf("Apple") !== -1;
            n = window.opera && window.opera.buildNumber;
            return {
                windows: navigator.platform.indexOf("Win") !== -1,
                android: /Android/.test(q),
                ie: !o && !n && /MSIE/gi.test(q) && /Explorer/gi.test(r.appName),
                webkit: o,
                gecko: !o && /Gecko/.test(q),
                safari: p,
                opera: !!n
            };
        }(),
        typeOf: function(n) {
            return {}.toString.call(n).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
        },
        extend: function(n) {
            g.each(arguments, function(o, p) {
                if (p > 0) {
                    g.each(o, function(r, q) {
                        n[q] = r;
                    });
                }
            });
            return n;
        },
        cleanName: function(n) {
            var o, p;
            p = [ /[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u" ];
            for (o = 0; o < p.length; o += 2) {
                n = n.replace(p[o], p[o + 1]);
            }
            n = n.replace(/\s+/g, "_");
            n = n.replace(/[^a-z0-9_\-\.]+/gi, "");
            return n;
        },
        addRuntime: function(n, o) {
            o.name = n;
            k[n] = o;
            k.push(o);
            return o;
        },
        guid: function() {
            var n = new Date().getTime().toString(32), o;
            for (o = 0; o < 5; o++) {
                n += Math.floor(Math.random() * 65535).toString(32);
            }
            return (g.guidPrefix || "p") + n + (f++).toString(32);
        },
        buildUrl: function(o, n) {
            var p = "";
            g.each(n, function(r, q) {
                p += (p ? "&" : "") + encodeURIComponent(q) + "=" + encodeURIComponent(r);
            });
            if (p) {
                o += (o.indexOf("?") > 0 ? "&" : "?") + p;
            }
            return o;
        },
        each: function(q, r) {
            var p, o, n;
            if (q) {
                p = q.length;
                if (p === b) {
                    for (o in q) {
                        if (q.hasOwnProperty(o)) {
                            if (r(q[o], o) === false) {
                                return;
                            }
                        }
                    }
                } else {
                    for (n = 0; n < p; n++) {
                        if (r(q[n], n) === false) {
                            return;
                        }
                    }
                }
            }
        },
        formatSize: function(n) {
            if (n === b || /\D/.test(n)) {
                return g.translate("N/A");
            }
            if (n > 1073741824) {
                return Math.round(n / 1073741824, 1) + " GB";
            }
            if (n > 1048576) {
                return Math.round(n / 1048576, 1) + " MB";
            }
            if (n > 1024) {
                return Math.round(n / 1024, 1) + " KB";
            }
            return n + " b";
        },
        getPos: function(o, s) {
            var t = 0, r = 0, v, u = document, p, q;
            o = o;
            s = s || u.body;
            function n(B) {
                var z, A, w = 0, C = 0;
                if (B) {
                    A = B.getBoundingClientRect();
                    z = u.compatMode === "CSS1Compat" ? u.documentElement : u.body;
                    w = A.left + z.scrollLeft;
                    C = A.top + z.scrollTop;
                }
                return {
                    x: w,
                    y: C
                };
            }
            if (o && o.getBoundingClientRect && g.ua.ie && (!u.documentMode || u.documentMode < 8)) {
                p = n(o);
                q = n(s);
                return {
                    x: p.x - q.x,
                    y: p.y - q.y
                };
            }
            v = o;
            while (v && v != s && v.nodeType) {
                t += v.offsetLeft || 0;
                r += v.offsetTop || 0;
                v = v.offsetParent;
            }
            v = o.parentNode;
            while (v && v != s && v.nodeType) {
                t -= v.scrollLeft || 0;
                r -= v.scrollTop || 0;
                v = v.parentNode;
            }
            return {
                x: t,
                y: r
            };
        },
        getSize: function(n) {
            return {
                w: n.offsetWidth || n.clientWidth,
                h: n.offsetHeight || n.clientHeight
            };
        },
        parseSize: function(n) {
            var o;
            if (typeof n == "string") {
                n = /^([0-9]+)([mgk]?)$/.exec(n.toLowerCase().replace(/[^0-9mkg]/g, ""));
                o = n[2];
                n = +n[1];
                if (o == "g") {
                    n *= 1073741824;
                }
                if (o == "m") {
                    n *= 1048576;
                }
                if (o == "k") {
                    n *= 1024;
                }
            }
            return n;
        },
        xmlEncode: function(n) {
            return n ? ("" + n).replace(l, function(o) {
                return a[o] ? "&" + a[o] + ";" : o;
            }) : n;
        },
        toArray: function(p) {
            var o, n = [];
            for (o = 0; o < p.length; o++) {
                n[o] = p[o];
            }
            return n;
        },
        inArray: function(p, q) {
            if (q) {
                if (Array.prototype.indexOf) {
                    return Array.prototype.indexOf.call(q, p);
                }
                for (var n = 0, o = q.length; n < o; n++) {
                    if (q[n] === p) {
                        return n;
                    }
                }
            }
            return -1;
        },
        addI18n: function(n) {
            return g.extend(m, n);
        },
        translate: function(n) {
            return m[n] || n;
        },
        isEmptyObj: function(n) {
            if (n === b) {
                return true;
            }
            for (var o in n) {
                return false;
            }
            return true;
        },
        hasClass: function(p, o) {
            var n;
            if (p.className == "") {
                return false;
            }
            n = new RegExp("(^|\\s+)" + o + "(\\s+|$)");
            return n.test(p.className);
        },
        addClass: function(o, n) {
            if (!g.hasClass(o, n)) {
                o.className = o.className == "" ? n : o.className.replace(/\s+$/, "") + " " + n;
            }
        },
        removeClass: function(p, o) {
            var n = new RegExp("(^|\\s+)" + o + "(\\s+|$)");
            p.className = p.className.replace(n, function(r, q, s) {
                return q === " " && s === " " ? " " : "";
            });
        },
        getStyle: function(o, n) {
            if (o.currentStyle) {
                return o.currentStyle[n];
            } else {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(o, null)[n];
                }
            }
        },
        addEvent: function(s, n, t) {
            var r, q, p, o;
            o = arguments[3];
            n = n.toLowerCase();
            if (e === b) {
                e = "Plupload_" + g.guid();
            }
            if (s.addEventListener) {
                r = t;
                s.addEventListener(n, r, false);
            } else {
                if (s.attachEvent) {
                    r = function() {
                        var u = window.event;
                        if (!u.target) {
                            u.target = u.srcElement;
                        }
                        u.preventDefault = h;
                        u.stopPropagation = j;
                        t(u);
                    };
                    s.attachEvent("on" + n, r);
                }
            }
            if (s[e] === b) {
                s[e] = g.guid();
            }
            if (!d.hasOwnProperty(s[e])) {
                d[s[e]] = {};
            }
            q = d[s[e]];
            if (!q.hasOwnProperty(n)) {
                q[n] = [];
            }
            q[n].push({
                func: r,
                orig: t,
                key: o
            });
        },
        removeEvent: function(s, n) {
            var q, t, p;
            if (typeof arguments[2] == "function") {
                t = arguments[2];
            } else {
                p = arguments[2];
            }
            n = n.toLowerCase();
            if (s[e] && d[s[e]] && d[s[e]][n]) {
                q = d[s[e]][n];
            } else {
                return;
            }
            for (var o = q.length - 1; o >= 0; o--) {
                if (q[o].key === p || q[o].orig === t) {
                    if (s.removeEventListener) {
                        s.removeEventListener(n, q[o].func, false);
                    } else {
                        if (s.detachEvent) {
                            s.detachEvent("on" + n, q[o].func);
                        }
                    }
                    q[o].orig = null;
                    q[o].func = null;
                    q.splice(o, 1);
                    if (t !== b) {
                        break;
                    }
                }
            }
            if (!q.length) {
                delete d[s[e]][n];
            }
            if (g.isEmptyObj(d[s[e]])) {
                delete d[s[e]];
                try {
                    delete s[e];
                } catch (r) {
                    s[e] = b;
                }
            }
        },
        removeAllEvents: function(o) {
            var n = arguments[1];
            if (o[e] === b || !o[e]) {
                return;
            }
            g.each(d[o[e]], function(q, p) {
                g.removeEvent(o, p, n);
            });
        }
    };
    g.Uploader = function(r) {
        var o = {}, u, t = [], q, p = false;
        u = new g.QueueProgress();
        r = g.extend({
            chunk_size: 0,
            multipart: true,
            multi_selection: true,
            file_data_name: "file",
            filters: []
        }, r);
        function s() {
            var w, x = 0, v;
            if (this.state == g.STARTED) {
                for (v = 0; v < t.length; v++) {
                    if (!w && t[v].status == g.QUEUED) {
                        w = t[v];
                        w.status = g.UPLOADING;
                        if (this.trigger("BeforeUpload", w)) {
                            this.trigger("UploadFile", w);
                        }
                    } else {
                        x++;
                    }
                }
                if (x == t.length) {
                    this.stop();
                    this.trigger("UploadComplete", t);
                }
            }
        }
        function n() {
            var w, v;
            u.reset();
            for (w = 0; w < t.length; w++) {
                v = t[w];
                if (v.size !== b) {
                    u.size += v.size;
                    u.loaded += v.loaded;
                } else {
                    u.size = b;
                }
                if (v.status == g.DONE) {
                    u.uploaded++;
                } else {
                    if (v.status == g.FAILED) {
                        u.failed++;
                    } else {
                        u.queued++;
                    }
                }
            }
            if (u.size === b) {
                u.percent = t.length > 0 ? Math.ceil(u.uploaded / t.length * 100) : 0;
            } else {
                u.bytesPerSec = Math.ceil(u.loaded / ((+new Date() - q || 1) / 1e3));
                u.percent = u.size > 0 ? Math.ceil(u.loaded / u.size * 100) : 0;
            }
        }
        g.extend(this, {
            state: g.STOPPED,
            runtime: "",
            features: {},
            files: t,
            settings: r,
            total: u,
            id: g.guid(),
            init: function() {
                var A = this, B, x, w, z = 0, y;
                if (typeof r.preinit == "function") {
                    r.preinit(A);
                } else {
                    g.each(r.preinit, function(D, C) {
                        A.bind(C, D);
                    });
                }
                r.page_url = r.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/");
                if (!/^(\w+:\/\/|\/)/.test(r.url)) {
                    r.url = r.page_url + r.url;
                }
                r.chunk_size = g.parseSize(r.chunk_size);
                r.max_file_size = g.parseSize(r.max_file_size);
                A.bind("FilesAdded", function(C, F) {
                    var E, D, H = 0, I, G = r.filters;
                    if (G && G.length) {
                        I = [];
                        g.each(G, function(J) {
                            g.each(J.extensions.split(/,/), function(K) {
                                if (/^\s*\*\s*$/.test(K)) {
                                    I.push("\\.*");
                                } else {
                                    I.push("\\." + K.replace(new RegExp("[" + "/^$.*+?|()[]{}\\".replace(/./g, "\\$&") + "]", "g"), "\\$&"));
                                }
                            });
                        });
                        I = new RegExp(I.join("|") + "$", "i");
                    }
                    for (E = 0; E < F.length; E++) {
                        D = F[E];
                        D.loaded = 0;
                        D.percent = 0;
                        D.status = g.QUEUED;
                        if (I && !I.test(D.name)) {
                            C.trigger("Error", {
                                code: g.FILE_EXTENSION_ERROR,
                                message: g.translate("File extension error."),
                                file: D
                            });
                            continue;
                        }
                        if (D.size !== b && D.size > r.max_file_size) {
                            C.trigger("Error", {
                                code: g.FILE_SIZE_ERROR,
                                message: g.translate("File size error."),
                                file: D
                            });
                            continue;
                        }
                        t.push(D);
                        H++;
                    }
                    if (H) {
                        c(function() {
                            A.trigger("QueueChanged");
                            A.refresh();
                        }, 1);
                    } else {
                        return false;
                    }
                });
                if (r.unique_names) {
                    A.bind("UploadFile", function(C, D) {
                        var F = D.name.match(/\.([^.]+)$/), E = "tmp";
                        if (F) {
                            E = F[1];
                        }
                        D.target_name = D.id + "." + E;
                    });
                }
                A.bind("UploadProgress", function(C, D) {
                    D.percent = D.size > 0 ? Math.ceil(D.loaded / D.size * 100) : 100;
                    n();
                });
                A.bind("StateChanged", function(C) {
                    if (C.state == g.STARTED) {
                        q = +new Date();
                    } else {
                        if (C.state == g.STOPPED) {
                            for (B = C.files.length - 1; B >= 0; B--) {
                                if (C.files[B].status == g.UPLOADING) {
                                    C.files[B].status = g.QUEUED;
                                    n();
                                }
                            }
                        }
                    }
                });
                A.bind("QueueChanged", n);
                A.bind("Error", function(C, D) {
                    if (D.file) {
                        D.file.status = g.FAILED;
                        n();
                        if (C.state == g.STARTED) {
                            c(function() {
                                s.call(A);
                            }, 1);
                        }
                    }
                });
                A.bind("FileUploaded", function(C, D) {
                    D.status = g.DONE;
                    D.loaded = D.size;
                    C.trigger("UploadProgress", D);
                    c(function() {
                        s.call(A);
                    }, 1);
                });
                if (r.runtimes) {
                    x = [];
                    y = r.runtimes.split(/\s?,\s?/);
                    for (B = 0; B < y.length; B++) {
                        if (k[y[B]]) {
                            x.push(k[y[B]]);
                        }
                    }
                } else {
                    x = k;
                }
                function v() {
                    var F = x[z++], E, C, D;
                    if (F) {
                        E = F.getFeatures();
                        C = A.settings.required_features;
                        if (C) {
                            C = C.split(",");
                            for (D = 0; D < C.length; D++) {
                                if (!E[C[D]]) {
                                    v();
                                    return;
                                }
                            }
                        }
                        F.init(A, function(G) {
                            if (G && G.success) {
                                A.features = E;
                                A.runtime = F.name;
                                A.trigger("Init", {
                                    runtime: F.name
                                });
                                A.trigger("PostInit");
                                A.refresh();
                            } else {
                                v();
                            }
                        });
                    } else {
                        A.trigger("Error", {
                            code: g.INIT_ERROR,
                            message: g.translate("Init error.")
                        });
                    }
                }
                v();
                if (typeof r.init == "function") {
                    r.init(A);
                } else {
                    g.each(r.init, function(D, C) {
                        A.bind(C, D);
                    });
                }
            },
            refresh: function() {
                this.trigger("Refresh");
            },
            start: function() {
                if (t.length && this.state != g.STARTED) {
                    this.state = g.STARTED;
                    this.trigger("StateChanged");
                    s.call(this);
                }
            },
            stop: function() {
                if (this.state != g.STOPPED) {
                    this.state = g.STOPPED;
                    this.trigger("CancelUpload");
                    this.trigger("StateChanged");
                }
            },
            disableBrowse: function() {
                p = arguments[0] !== b ? arguments[0] : true;
                this.trigger("DisableBrowse", p);
            },
            getFile: function(w) {
                var v;
                for (v = t.length - 1; v >= 0; v--) {
                    if (t[v].id === w) {
                        return t[v];
                    }
                }
            },
            removeFile: function(w) {
                var v;
                for (v = t.length - 1; v >= 0; v--) {
                    if (t[v].id === w.id) {
                        return this.splice(v, 1)[0];
                    }
                }
            },
            splice: function(x, v) {
                var w;
                w = t.splice(x === b ? 0 : x, v === b ? t.length : v);
                this.trigger("FilesRemoved", w);
                this.trigger("QueueChanged");
                return w;
            },
            trigger: function(w) {
                var y = o[w.toLowerCase()], x, v;
                if (y) {
                    v = Array.prototype.slice.call(arguments);
                    v[0] = this;
                    for (x = 0; x < y.length; x++) {
                        if (y[x].func.apply(y[x].scope, v) === false) {
                            return false;
                        }
                    }
                }
                return true;
            },
            hasEventListener: function(v) {
                return !!o[v.toLowerCase()];
            },
            bind: function(v, x, w) {
                var y;
                v = v.toLowerCase();
                y = o[v] || [];
                y.push({
                    func: x,
                    scope: w || this
                });
                o[v] = y;
            },
            unbind: function(v) {
                v = v.toLowerCase();
                var y = o[v], w, x = arguments[1];
                if (y) {
                    if (x !== b) {
                        for (w = y.length - 1; w >= 0; w--) {
                            if (y[w].func === x) {
                                y.splice(w, 1);
                                break;
                            }
                        }
                    } else {
                        y = [];
                    }
                    if (!y.length) {
                        delete o[v];
                    }
                }
            },
            unbindAll: function() {
                var v = this;
                g.each(o, function(x, w) {
                    v.unbind(w);
                });
            },
            destroy: function() {
                this.stop();
                this.trigger("Destroy");
                this.unbindAll();
            }
        });
    };
    g.File = function(q, o, p) {
        var n = this;
        n.id = q;
        n.name = o;
        n.size = p;
        n.loaded = 0;
        n.percent = 0;
        n.status = 0;
    };
    g.Runtime = function() {
        this.getFeatures = function() {};
        this.init = function(n, o) {};
    };
    g.QueueProgress = function() {
        var n = this;
        n.size = 0;
        n.loaded = 0;
        n.uploaded = 0;
        n.failed = 0;
        n.queued = 0;
        n.percent = 0;
        n.bytesPerSec = 0;
        n.reset = function() {
            n.size = n.loaded = n.uploaded = n.failed = n.queued = n.percent = n.bytesPerSec = 0;
        };
    };
    g.runtimes = {};
    window.plupload = g;
})();

(function(f, b, d, e) {
    var a = {}, g = {};
    function c() {
        var h;
        try {
            h = navigator.plugins["Shockwave Flash"];
            h = h.description;
        } catch (j) {
            try {
                h = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
            } catch (i) {
                h = "0.0";
            }
        }
        h = h.match(/\d+/g);
        return parseFloat(h[0] + "." + h[1]);
    }
    d.flash = {
        trigger: function(j, h, i) {
            setTimeout(function() {
                var m = a[j], l, k;
                if (m) {
                    m.trigger("Flash:" + h, i);
                }
            }, 0);
        }
    };
    d.runtimes.Flash = d.addRuntime("flash", {
        getFeatures: function() {
            return {
                jpgresize: true,
                pngresize: true,
                maxWidth: 8091,
                maxHeight: 8091,
                chunks: true,
                progress: true,
                multipart: true,
                multi_selection: true
            };
        },
        init: function(m, o) {
            var k, l, h = 0, i = b.body;
            if (c() < 10) {
                o({
                    success: false
                });
                return;
            }
            g[m.id] = false;
            a[m.id] = m;
            k = b.getElementById(m.settings.browse_button);
            l = b.createElement("div");
            l.id = m.id + "_flash_container";
            d.extend(l.style, {
                position: "absolute",
                top: "0px",
                background: m.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100%",
                height: "100%"
            });
            l.className = "plupload flash";
            if (m.settings.container) {
                i = b.getElementById(m.settings.container);
                if (d.getStyle(i, "position") === "static") {
                    i.style.position = "relative";
                }
            }
            i.appendChild(l);
            (function() {
                var p, q;
                p = '<object id="' + m.id + '_flash" type="application/x-shockwave-flash" data="' + m.settings.flash_swf_url + '" ';
                if (d.ua.ie) {
                    p += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                }
                p += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + m.settings.flash_swf_url + '" /><param name="flashvars" value="id=' + escape(m.id) + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';
                if (d.ua.ie) {
                    q = b.createElement("div");
                    l.appendChild(q);
                    q.outerHTML = p;
                    q = null;
                } else {
                    l.innerHTML = p;
                }
            })();
            function n() {
                return b.getElementById(m.id + "_flash");
            }
            function j() {
                if (h++ > 5e3) {
                    o({
                        success: false
                    });
                    return;
                }
                if (g[m.id] === false) {
                    setTimeout(j, 1);
                }
            }
            j();
            k = l = null;
            m.bind("Destroy", function(p) {
                var q;
                d.removeAllEvents(b.body, p.id);
                delete g[p.id];
                delete a[p.id];
                q = b.getElementById(p.id + "_flash_container");
                if (q) {
                    q.parentNode.removeChild(q);
                }
            });
            m.bind("Flash:Init", function() {
                var r = {}, q;
                try {
                    n().setFileFilters(m.settings.filters, m.settings.multi_selection);
                } catch (p) {
                    o({
                        success: false
                    });
                    return;
                }
                if (g[m.id]) {
                    return;
                }
                g[m.id] = true;
                m.bind("UploadFile", function(s, u) {
                    var v = s.settings, t = m.settings.resize || {};
                    n().uploadFile(r[u.id], v.url, {
                        name: u.target_name || u.name,
                        mime: d.mimeTypes[u.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: v.chunk_size,
                        width: t.width,
                        height: t.height,
                        quality: t.quality,
                        multipart: v.multipart,
                        multipart_params: v.multipart_params || {},
                        file_data_name: v.file_data_name,
                        format: /\.(jpg|jpeg)$/i.test(u.name) ? "jpg" : "png",
                        headers: v.headers,
                        urlstream_upload: v.urlstream_upload
                    });
                });
                m.bind("CancelUpload", function() {
                    n().cancelUpload();
                });
                m.bind("Flash:UploadProcess", function(t, s) {
                    var u = t.getFile(r[s.id]);
                    if (u.status != d.FAILED) {
                        u.loaded = s.loaded;
                        u.size = s.size;
                        t.trigger("UploadProgress", u);
                    }
                });
                m.bind("Flash:UploadChunkComplete", function(s, u) {
                    var v, t = s.getFile(r[u.id]);
                    v = {
                        chunk: u.chunk,
                        chunks: u.chunks,
                        response: u.text
                    };
                    s.trigger("ChunkUploaded", t, v);
                    if (t.status !== d.FAILED && s.state !== d.STOPPED) {
                        n().uploadNextChunk();
                    }
                    if (u.chunk == u.chunks - 1) {
                        t.status = d.DONE;
                        s.trigger("FileUploaded", t, {
                            response: u.text
                        });
                    }
                });
                m.bind("Flash:SelectFiles", function(s, v) {
                    var u, t, w = [], x;
                    for (t = 0; t < v.length; t++) {
                        u = v[t];
                        x = d.guid();
                        r[x] = u.id;
                        r[u.id] = x;
                        w.push(new d.File(x, u.name, u.size));
                    }
                    if (w.length) {
                        m.trigger("FilesAdded", w);
                    }
                });
                m.bind("Flash:SecurityError", function(s, t) {
                    m.trigger("Error", {
                        code: d.SECURITY_ERROR,
                        message: d.translate("Security error."),
                        details: t.message,
                        file: m.getFile(r[t.id])
                    });
                });
                m.bind("Flash:GenericError", function(s, t) {
                    m.trigger("Error", {
                        code: d.GENERIC_ERROR,
                        message: d.translate("Generic error."),
                        details: t.message,
                        file: m.getFile(r[t.id])
                    });
                });
                m.bind("Flash:IOError", function(s, t) {
                    m.trigger("Error", {
                        code: d.IO_ERROR,
                        message: d.translate("IO error."),
                        details: t.message,
                        file: m.getFile(r[t.id])
                    });
                });
                m.bind("Flash:ImageError", function(s, t) {
                    m.trigger("Error", {
                        code: parseInt(t.code, 10),
                        message: d.translate("Image error."),
                        file: m.getFile(r[t.id])
                    });
                });
                m.bind("Flash:StageEvent:rollOver", function(s) {
                    var t, u;
                    t = b.getElementById(m.settings.browse_button);
                    u = s.settings.browse_button_hover;
                    if (t && u) {
                        d.addClass(t, u);
                    }
                });
                m.bind("Flash:StageEvent:rollOut", function(s) {
                    var t, u;
                    t = b.getElementById(m.settings.browse_button);
                    u = s.settings.browse_button_hover;
                    if (t && u) {
                        d.removeClass(t, u);
                    }
                });
                m.bind("Flash:StageEvent:mouseDown", function(s) {
                    var t, u;
                    t = b.getElementById(m.settings.browse_button);
                    u = s.settings.browse_button_active;
                    if (t && u) {
                        d.addClass(t, u);
                        d.addEvent(b.body, "mouseup", function() {
                            d.removeClass(t, u);
                        }, s.id);
                    }
                });
                m.bind("Flash:StageEvent:mouseUp", function(s) {
                    var t, u;
                    t = b.getElementById(m.settings.browse_button);
                    u = s.settings.browse_button_active;
                    if (t && u) {
                        d.removeClass(t, u);
                    }
                });
                m.bind("Flash:ExifData", function(s, t) {
                    m.trigger("ExifData", m.getFile(r[t.id]), t.data);
                });
                m.bind("Flash:GpsData", function(s, t) {
                    m.trigger("GpsData", m.getFile(r[t.id]), t.data);
                });
                m.bind("QueueChanged", function(s) {
                    m.refresh();
                });
                m.bind("FilesRemoved", function(s, u) {
                    var t;
                    for (t = 0; t < u.length; t++) {
                        n().removeFile(r[u[t].id]);
                    }
                });
                m.bind("StateChanged", function(s) {
                    m.refresh();
                });
                m.bind("Refresh", function(s) {
                    var t, u, v;
                    n().setFileFilters(m.settings.filters, m.settings.multi_selection);
                    t = b.getElementById(s.settings.browse_button);
                    if (t) {
                        u = d.getPos(t, b.getElementById(s.settings.container));
                        v = d.getSize(t);
                        d.extend(b.getElementById(s.id + "_flash_container").style, {
                            top: u.y + "px",
                            left: u.x + "px",
                            width: v.w + "px",
                            height: v.h + "px"
                        });
                    }
                });
                m.bind("DisableBrowse", function(s, t) {
                    n().disableBrowse(t);
                });
                o({
                    success: true
                });
            });
        }
    });
})(window, document, plupload);

(function(h, k, j, e) {
    var c = {}, g;
    function m(o, p) {
        var n;
        if ("FileReader" in h) {
            n = new FileReader();
            n.readAsDataURL(o);
            n.onload = function() {
                p(n.result);
            };
        } else {
            return p(o.getAsDataURL());
        }
    }
    function l(o, p) {
        var n;
        if ("FileReader" in h) {
            n = new FileReader();
            n.readAsBinaryString(o);
            n.onload = function() {
                p(n.result);
            };
        } else {
            return p(o.getAsBinary());
        }
    }
    function d(r, p, n, v) {
        var q, o, u, s, t = this;
        m(c[r.id], function(w) {
            q = k.createElement("canvas");
            q.style.display = "none";
            k.body.appendChild(q);
            o = q.getContext("2d");
            u = new Image();
            u.onerror = u.onabort = function() {
                v({
                    success: false
                });
            };
            u.onload = function() {
                var C, x, z, y, B;
                if (!p.width) {
                    p.width = u.width;
                }
                if (!p.height) {
                    p.height = u.height;
                }
                s = Math.min(p.width / u.width, p.height / u.height);
                if (s < 1) {
                    C = Math.round(u.width * s);
                    x = Math.round(u.height * s);
                } else {
                    if (p.quality && n === "image/jpeg") {
                        C = u.width;
                        x = u.height;
                    } else {
                        v({
                            success: false
                        });
                        return;
                    }
                }
                q.width = C;
                q.height = x;
                o.drawImage(u, 0, 0, C, x);
                if (n === "image/jpeg") {
                    y = new f(atob(w.substring(w.indexOf("base64,") + 7)));
                    if (y.headers && y.headers.length) {
                        B = new a();
                        if (B.init(y.get("exif")[0])) {
                            B.setExif("PixelXDimension", C);
                            B.setExif("PixelYDimension", x);
                            y.set("exif", B.getBinary());
                            if (t.hasEventListener("ExifData")) {
                                t.trigger("ExifData", r, B.EXIF());
                            }
                            if (t.hasEventListener("GpsData")) {
                                t.trigger("GpsData", r, B.GPS());
                            }
                        }
                    }
                }
                if (p.quality && n === "image/jpeg") {
                    try {
                        w = q.toDataURL(n, p.quality / 100);
                    } catch (A) {
                        w = q.toDataURL(n);
                    }
                } else {
                    w = q.toDataURL(n);
                }
                w = w.substring(w.indexOf("base64,") + 7);
                w = atob(w);
                if (y && y.headers && y.headers.length) {
                    w = y.restore(w);
                    y.purge();
                }
                q.parentNode.removeChild(q);
                v({
                    success: true,
                    data: w
                });
            };
            u.src = w;
        });
    }
    j.runtimes.Html5 = j.addRuntime("html5", {
        getFeatures: function() {
            var s, o, r, q, p, n;
            o = r = p = n = false;
            if (h.XMLHttpRequest) {
                s = new XMLHttpRequest();
                r = !!s.upload;
                o = !!(s.sendAsBinary || s.upload);
            }
            if (o) {
                q = !!(s.sendAsBinary || h.Uint8Array && h.ArrayBuffer);
                p = !!(File && (File.prototype.getAsDataURL || h.FileReader) && q);
                n = !!(File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice));
            }
            g = j.ua.safari && j.ua.windows;
            return {
                html5: o,
                dragdrop: function() {
                    var t = k.createElement("div");
                    return "draggable" in t || "ondragstart" in t && "ondrop" in t;
                }(),
                jpgresize: p,
                pngresize: p,
                multipart: p || !!h.FileReader || !!h.FormData,
                canSendBinary: q,
                cantSendBlobInFormData: !!(j.ua.gecko && h.FormData && h.FileReader && !FileReader.prototype.readAsArrayBuffer) || j.ua.android,
                progress: r,
                chunks: n,
                multi_selection: !(j.ua.safari && j.ua.windows),
                triggerDialog: j.ua.gecko && h.FormData || j.ua.webkit
            };
        },
        init: function(p, r) {
            var n, q;
            function o(w) {
                var u, t, v = [], x, s = {};
                for (t = 0; t < w.length; t++) {
                    u = w[t];
                    if (s[u.name]) {
                        continue;
                    }
                    s[u.name] = true;
                    x = j.guid();
                    c[x] = u;
                    v.push(new j.File(x, u.fileName || u.name, u.fileSize || u.size));
                }
                if (v.length) {
                    p.trigger("FilesAdded", v);
                }
            }
            n = this.getFeatures();
            if (!n.html5) {
                r({
                    success: false
                });
                return;
            }
            p.bind("Init", function(w) {
                var G, F, C = [], v, D, t = w.settings.filters, u, B, s = k.body, E;
                G = k.createElement("div");
                G.id = w.id + "_html5_container";
                j.extend(G.style, {
                    position: "absolute",
                    background: p.settings.shim_bgcolor || "transparent",
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    zIndex: 99999,
                    opacity: p.settings.shim_bgcolor ? "" : 0
                });
                G.className = "plupload html5";
                if (p.settings.container) {
                    s = k.getElementById(p.settings.container);
                    if (j.getStyle(s, "position") === "static") {
                        s.style.position = "relative";
                    }
                }
                s.appendChild(G);
                no_type_restriction: for (v = 0; v < t.length; v++) {
                    u = t[v].extensions.split(/,/);
                    for (D = 0; D < u.length; D++) {
                        if (u[D] === "*") {
                            C = [];
                            break no_type_restriction;
                        }
                        B = j.mimeTypes[u[D]];
                        if (B && j.inArray(B, C) === -1) {
                            C.push(B);
                        }
                    }
                }
                G.innerHTML = '<input id="' + p.id + '_html5"  style="font-size:999px" type="file" accept="' + C.join(",") + '" ' + (p.settings.multi_selection && p.features.multi_selection ? 'multiple="multiple"' : "") + " />";
                G.scrollTop = 100;
                E = k.getElementById(p.id + "_html5");
                if (w.features.triggerDialog) {
                    j.extend(E.style, {
                        position: "absolute",
                        width: "100%",
                        height: "100%"
                    });
                } else {
                    j.extend(E.style, {
                        cssFloat: "right",
                        styleFloat: "right"
                    });
                }
                E.onchange = function() {
                    o(this.files);
                    this.value = "";
                };
                F = k.getElementById(w.settings.browse_button);
                if (F) {
                    var z = w.settings.browse_button_hover, A = w.settings.browse_button_active, x = w.features.triggerDialog ? F : G;
                    if (z) {
                        j.addEvent(x, "mouseover", function() {
                            j.addClass(F, z);
                        }, w.id);
                        j.addEvent(x, "mouseout", function() {
                            j.removeClass(F, z);
                        }, w.id);
                    }
                    if (A) {
                        j.addEvent(x, "mousedown", function() {
                            j.addClass(F, A);
                        }, w.id);
                        j.addEvent(k.body, "mouseup", function() {
                            j.removeClass(F, A);
                        }, w.id);
                    }
                    if (w.features.triggerDialog) {
                        j.addEvent(F, "click", function(H) {
                            var y = k.getElementById(w.id + "_html5");
                            if (y && !y.disabled) {
                                y.click();
                            }
                            H.preventDefault();
                        }, w.id);
                    }
                }
            });
            p.bind("PostInit", function() {
                var s = k.getElementById(p.settings.drop_element);
                if (s) {
                    if (g) {
                        j.addEvent(s, "dragenter", function(w) {
                            var v, t, u;
                            v = k.getElementById(p.id + "_drop");
                            if (!v) {
                                v = k.createElement("input");
                                v.setAttribute("type", "file");
                                v.setAttribute("id", p.id + "_drop");
                                v.setAttribute("multiple", "multiple");
                                j.addEvent(v, "change", function() {
                                    o(this.files);
                                    j.removeEvent(v, "change", p.id);
                                    v.parentNode.removeChild(v);
                                }, p.id);
                                j.addEvent(v, "dragover", function(x) {
                                    x.stopPropagation();
                                }, p.id);
                                s.appendChild(v);
                            }
                            t = j.getPos(s, k.getElementById(p.settings.container));
                            u = j.getSize(s);
                            if (j.getStyle(s, "position") === "static") {
                                j.extend(s.style, {
                                    position: "relative"
                                });
                            }
                            j.extend(v.style, {
                                position: "absolute",
                                display: "block",
                                top: 0,
                                left: 0,
                                width: u.w + "px",
                                height: u.h + "px",
                                opacity: 0
                            });
                        }, p.id);
                        return;
                    }
                    j.addEvent(s, "dragover", function(t) {
                        t.preventDefault();
                    }, p.id);
                    j.addEvent(s, "drop", function(u) {
                        var t = u.dataTransfer;
                        if (t && t.files) {
                            o(t.files);
                        }
                        u.preventDefault();
                    }, p.id);
                }
            });
            p.bind("Refresh", function(s) {
                var t, u, v, x, w;
                t = k.getElementById(p.settings.browse_button);
                if (t) {
                    u = j.getPos(t, k.getElementById(s.settings.container));
                    v = j.getSize(t);
                    x = k.getElementById(p.id + "_html5_container");
                    j.extend(x.style, {
                        top: u.y + "px",
                        left: u.x + "px",
                        width: v.w + "px",
                        height: v.h + "px"
                    });
                    if (p.features.triggerDialog) {
                        if (j.getStyle(t, "position") === "static") {
                            j.extend(t.style, {
                                position: "relative"
                            });
                        }
                        w = parseInt(j.getStyle(t, "zIndex"), 10);
                        if (isNaN(w)) {
                            w = 0;
                        }
                        j.extend(t.style, {
                            zIndex: w
                        });
                        j.extend(x.style, {
                            zIndex: w - 1
                        });
                    }
                }
            });
            p.bind("DisableBrowse", function(s, u) {
                var t = k.getElementById(s.id + "_html5");
                if (t) {
                    t.disabled = u;
                }
            });
            p.bind("CancelUpload", function() {
                if (q && q.abort) {
                    q.abort();
                }
            });
            p.bind("UploadFile", function(s, u) {
                var v = s.settings, y, t;
                function x(A, D, z) {
                    var B;
                    if (File.prototype.slice) {
                        try {
                            A.slice();
                            return A.slice(D, z);
                        } catch (C) {
                            return A.slice(D, z - D);
                        }
                    } else {
                        if (B = File.prototype.webkitSlice || File.prototype.mozSlice) {
                            return B.call(A, D, z);
                        } else {
                            return null;
                        }
                    }
                }
                function w(A) {
                    var D = 0, C = 0, z = "FileReader" in h ? new FileReader() : null;
                    function B() {
                        var J, N, L, M, I, K, F, E = s.settings.url;
                        function H(Q) {
                            if (q.sendAsBinary) {
                                q.sendAsBinary(Q);
                            } else {
                                if (s.features.canSendBinary) {
                                    var O = new Uint8Array(Q.length);
                                    for (var P = 0; P < Q.length; P++) {
                                        O[P] = Q.charCodeAt(P) & 255;
                                    }
                                    q.send(O.buffer);
                                }
                            }
                        }
                        function G(P) {
                            var T = 0, U = "----pluploadboundary" + j.guid(), R, Q = "--", S = "\r\n", O = "";
                            q = new XMLHttpRequest();
                            if (q.upload) {
                                q.upload.onprogress = function(V) {
                                    u.loaded = Math.min(u.size, C + V.loaded - T);
                                    s.trigger("UploadProgress", u);
                                };
                            }
                            q.onreadystatechange = function() {
                                var V, X;
                                if (q.readyState == 4 && s.state !== j.STOPPED) {
                                    try {
                                        V = q.status;
                                    } catch (W) {
                                        V = 0;
                                    }
                                    if (V >= 400) {
                                        s.trigger("Error", {
                                            code: j.HTTP_ERROR,
                                            message: j.translate("HTTP Error."),
                                            file: u,
                                            status: V
                                        });
                                    } else {
                                        if (L) {
                                            X = {
                                                chunk: D,
                                                chunks: L,
                                                response: q.responseText,
                                                status: V
                                            };
                                            s.trigger("ChunkUploaded", u, X);
                                            C += K;
                                            if (X.cancelled) {
                                                u.status = j.FAILED;
                                                return;
                                            }
                                            u.loaded = Math.min(u.size, (D + 1) * I);
                                        } else {
                                            u.loaded = u.size;
                                        }
                                        s.trigger("UploadProgress", u);
                                        P = J = R = O = null;
                                        if (!L || ++D >= L) {
                                            u.status = j.DONE;
                                            s.trigger("FileUploaded", u, {
                                                response: q.responseText,
                                                status: V
                                            });
                                        } else {
                                            B();
                                        }
                                    }
                                }
                            };
                            if (s.settings.multipart && n.multipart) {
                                M.name = u.target_name || u.name;
                                q.open("post", E, true);
                                j.each(s.settings.headers, function(W, V) {
                                    q.setRequestHeader(V, W);
                                });
                                if (typeof P !== "string" && !!h.FormData) {
                                    R = new FormData();
                                    j.each(j.extend(M, s.settings.multipart_params), function(W, V) {
                                        R.append(V, W);
                                    });
                                    R.append(s.settings.file_data_name, P);
                                    q.send(R);
                                    return;
                                }
                                if (typeof P === "string") {
                                    q.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + U);
                                    j.each(j.extend(M, s.settings.multipart_params), function(W, V) {
                                        O += Q + U + S + 'Content-Disposition: form-data; name="' + V + '"' + S + S;
                                        O += unescape(encodeURIComponent(W)) + S;
                                    });
                                    F = j.mimeTypes[u.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream";
                                    O += Q + U + S + 'Content-Disposition: form-data; name="' + s.settings.file_data_name + '"; filename="' + unescape(encodeURIComponent(u.name)) + '"' + S + "Content-Type: " + F + S + S + P + S + Q + U + Q + S;
                                    T = O.length - P.length;
                                    P = O;
                                    H(P);
                                    return;
                                }
                            }
                            E = j.buildUrl(s.settings.url, j.extend(M, s.settings.multipart_params));
                            q.open("post", E, true);
                            q.setRequestHeader("Content-Type", "application/octet-stream");
                            j.each(s.settings.headers, function(W, V) {
                                q.setRequestHeader(V, W);
                            });
                            if (typeof P === "string") {
                                H(P);
                            } else {
                                q.send(P);
                            }
                        }
                        if (u.status == j.DONE || u.status == j.FAILED || s.state == j.STOPPED) {
                            return;
                        }
                        M = {
                            name: u.target_name || u.name
                        };
                        if (v.chunk_size && u.size > v.chunk_size && (n.chunks || typeof A == "string")) {
                            I = v.chunk_size;
                            L = Math.ceil(u.size / I);
                            K = Math.min(I, u.size - D * I);
                            if (typeof A == "string") {
                                J = A.substring(D * I, D * I + K);
                            } else {
                                J = x(A, D * I, D * I + K);
                            }
                            M.chunk = D;
                            M.chunks = L;
                        } else {
                            K = u.size;
                            J = A;
                        }
                        if (s.settings.multipart && n.multipart && typeof J !== "string" && z && n.cantSendBlobInFormData && n.chunks && s.settings.chunk_size) {
                            z.onload = function() {
                                G(z.result);
                            };
                            z.readAsBinaryString(J);
                        } else {
                            G(J);
                        }
                    }
                    B();
                }
                y = c[u.id];
                if (n.jpgresize && s.settings.resize && /\.(png|jpg|jpeg)$/i.test(u.name)) {
                    d.call(s, u, s.settings.resize, /\.png$/i.test(u.name) ? "image/png" : "image/jpeg", function(z) {
                        if (z.success) {
                            u.size = z.data.length;
                            w(z.data);
                        } else {
                            if (n.chunks) {
                                w(y);
                            } else {
                                l(y, w);
                            }
                        }
                    });
                } else {
                    if (!n.chunks && n.jpgresize) {
                        l(y, w);
                    } else {
                        w(y);
                    }
                }
            });
            p.bind("Destroy", function(s) {
                var u, v, t = k.body, w = {
                    inputContainer: s.id + "_html5_container",
                    inputFile: s.id + "_html5",
                    browseButton: s.settings.browse_button,
                    dropElm: s.settings.drop_element
                };
                for (u in w) {
                    v = k.getElementById(w[u]);
                    if (v) {
                        j.removeAllEvents(v, s.id);
                    }
                }
                j.removeAllEvents(k.body, s.id);
                if (s.settings.container) {
                    t = k.getElementById(s.settings.container);
                }
                t.removeChild(k.getElementById(w.inputContainer));
            });
            r({
                success: true
            });
        }
    });
    function b() {
        var q = false, o;
        function r(t, v) {
            var s = q ? 0 : -8 * (v - 1), w = 0, u;
            for (u = 0; u < v; u++) {
                w |= o.charCodeAt(t + u) << Math.abs(s + u * 8);
            }
            return w;
        }
        function n(u, s, t) {
            var t = arguments.length === 3 ? t : o.length - s - 1;
            o = o.substr(0, s) + u + o.substr(t + s);
        }
        function p(t, u, w) {
            var x = "", s = q ? 0 : -8 * (w - 1), v;
            for (v = 0; v < w; v++) {
                x += String.fromCharCode(u >> Math.abs(s + v * 8) & 255);
            }
            n(x, t, w);
        }
        return {
            II: function(s) {
                if (s === e) {
                    return q;
                } else {
                    q = s;
                }
            },
            init: function(s) {
                q = false;
                o = s;
            },
            SEGMENT: function(s, u, t) {
                switch (arguments.length) {
                  case 1:
                    return o.substr(s, o.length - s - 1);

                  case 2:
                    return o.substr(s, u);

                  case 3:
                    n(t, s, u);
                    break;

                  default:
                    return o;
                }
            },
            BYTE: function(s) {
                return r(s, 1);
            },
            SHORT: function(s) {
                return r(s, 2);
            },
            LONG: function(s, t) {
                if (t === e) {
                    return r(s, 4);
                } else {
                    p(s, t, 4);
                }
            },
            SLONG: function(s) {
                var t = r(s, 4);
                return t > 2147483647 ? t - 4294967296 : t;
            },
            STRING: function(s, t) {
                var u = "";
                for (t += s; s < t; s++) {
                    u += String.fromCharCode(r(s, 1));
                }
                return u;
            }
        };
    }
    function f(s) {
        var u = {
            65505: {
                app: "EXIF",
                name: "APP1",
                signature: "Exif\0"
            },
            65506: {
                app: "ICC",
                name: "APP2",
                signature: "ICC_PROFILE\0"
            },
            65517: {
                app: "IPTC",
                name: "APP13",
                signature: "Photoshop 3.0\0"
            }
        }, t = [], r, n, p = e, q = 0, o;
        r = new b();
        r.init(s);
        if (r.SHORT(0) !== 65496) {
            return;
        }
        n = 2;
        o = Math.min(1048576, s.length);
        while (n <= o) {
            p = r.SHORT(n);
            if (p >= 65488 && p <= 65495) {
                n += 2;
                continue;
            }
            if (p === 65498 || p === 65497) {
                break;
            }
            q = r.SHORT(n + 2) + 2;
            if (u[p] && r.STRING(n + 4, u[p].signature.length) === u[p].signature) {
                t.push({
                    hex: p,
                    app: u[p].app.toUpperCase(),
                    name: u[p].name.toUpperCase(),
                    start: n,
                    length: q,
                    segment: r.SEGMENT(n, q)
                });
            }
            n += q;
        }
        r.init(null);
        return {
            headers: t,
            restore: function(y) {
                r.init(y);
                var w = new f(y);
                if (!w.headers) {
                    return false;
                }
                for (var x = w.headers.length; x > 0; x--) {
                    var z = w.headers[x - 1];
                    r.SEGMENT(z.start, z.length, "");
                }
                w.purge();
                n = r.SHORT(2) == 65504 ? 4 + r.SHORT(4) : 2;
                for (var x = 0, v = t.length; x < v; x++) {
                    r.SEGMENT(n, 0, t[x].segment);
                    n += t[x].length;
                }
                return r.SEGMENT();
            },
            get: function(x) {
                var y = [];
                for (var w = 0, v = t.length; w < v; w++) {
                    if (t[w].app === x.toUpperCase()) {
                        y.push(t[w].segment);
                    }
                }
                return y;
            },
            set: function(y, x) {
                var z = [];
                if (typeof x === "string") {
                    z.push(x);
                } else {
                    z = x;
                }
                for (var w = ii = 0, v = t.length; w < v; w++) {
                    if (t[w].app === y.toUpperCase()) {
                        t[w].segment = z[ii];
                        t[w].length = z[ii].length;
                        ii++;
                    }
                    if (ii >= z.length) {
                        break;
                    }
                }
            },
            purge: function() {
                t = [];
                r.init(null);
            }
        };
    }
    function a() {
        var q, n, o = {}, t;
        q = new b();
        n = {
            tiff: {
                274: "Orientation",
                34665: "ExifIFDPointer",
                34853: "GPSInfoIFDPointer"
            },
            exif: {
                36864: "ExifVersion",
                40961: "ColorSpace",
                40962: "PixelXDimension",
                40963: "PixelYDimension",
                36867: "DateTimeOriginal",
                33434: "ExposureTime",
                33437: "FNumber",
                34855: "ISOSpeedRatings",
                37377: "ShutterSpeedValue",
                37378: "ApertureValue",
                37383: "MeteringMode",
                37384: "LightSource",
                37385: "Flash",
                41986: "ExposureMode",
                41987: "WhiteBalance",
                41990: "SceneCaptureType",
                41988: "DigitalZoomRatio",
                41992: "Contrast",
                41993: "Saturation",
                41994: "Sharpness"
            },
            gps: {
                0: "GPSVersionID",
                1: "GPSLatitudeRef",
                2: "GPSLatitude",
                3: "GPSLongitudeRef",
                4: "GPSLongitude"
            }
        };
        t = {
            ColorSpace: {
                1: "sRGB",
                0: "Uncalibrated"
            },
            MeteringMode: {
                0: "Unknown",
                1: "Average",
                2: "CenterWeightedAverage",
                3: "Spot",
                4: "MultiSpot",
                5: "Pattern",
                6: "Partial",
                255: "Other"
            },
            LightSource: {
                1: "Daylight",
                2: "Fliorescent",
                3: "Tungsten",
                4: "Flash",
                9: "Fine weather",
                10: "Cloudy weather",
                11: "Shade",
                12: "Daylight fluorescent (D 5700 - 7100K)",
                13: "Day white fluorescent (N 4600 -5400K)",
                14: "Cool white fluorescent (W 3900 - 4500K)",
                15: "White fluorescent (WW 3200 - 3700K)",
                17: "Standard light A",
                18: "Standard light B",
                19: "Standard light C",
                20: "D55",
                21: "D65",
                22: "D75",
                23: "D50",
                24: "ISO studio tungsten",
                255: "Other"
            },
            Flash: {
                0: "Flash did not fire.",
                1: "Flash fired.",
                5: "Strobe return light not detected.",
                7: "Strobe return light detected.",
                9: "Flash fired, compulsory flash mode",
                13: "Flash fired, compulsory flash mode, return light not detected",
                15: "Flash fired, compulsory flash mode, return light detected",
                16: "Flash did not fire, compulsory flash mode",
                24: "Flash did not fire, auto mode",
                25: "Flash fired, auto mode",
                29: "Flash fired, auto mode, return light not detected",
                31: "Flash fired, auto mode, return light detected",
                32: "No flash function",
                65: "Flash fired, red-eye reduction mode",
                69: "Flash fired, red-eye reduction mode, return light not detected",
                71: "Flash fired, red-eye reduction mode, return light detected",
                73: "Flash fired, compulsory flash mode, red-eye reduction mode",
                77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                89: "Flash fired, auto mode, red-eye reduction mode",
                93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
            },
            ExposureMode: {
                0: "Auto exposure",
                1: "Manual exposure",
                2: "Auto bracket"
            },
            WhiteBalance: {
                0: "Auto white balance",
                1: "Manual white balance"
            },
            SceneCaptureType: {
                0: "Standard",
                1: "Landscape",
                2: "Portrait",
                3: "Night scene"
            },
            Contrast: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            Saturation: {
                0: "Normal",
                1: "Low saturation",
                2: "High saturation"
            },
            Sharpness: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            GPSLatitudeRef: {
                N: "North latitude",
                S: "South latitude"
            },
            GPSLongitudeRef: {
                E: "East longitude",
                W: "West longitude"
            }
        };
        function p(u, C) {
            var w = q.SHORT(u), z, F, G, B, A, v, x, D, E = [], y = {};
            for (z = 0; z < w; z++) {
                x = v = u + 12 * z + 2;
                G = C[q.SHORT(x)];
                if (G === e) {
                    continue;
                }
                B = q.SHORT(x += 2);
                A = q.LONG(x += 2);
                x += 4;
                E = [];
                switch (B) {
                  case 1:
                  case 7:
                    if (A > 4) {
                        x = q.LONG(x) + o.tiffHeader;
                    }
                    for (F = 0; F < A; F++) {
                        E[F] = q.BYTE(x + F);
                    }
                    break;

                  case 2:
                    if (A > 4) {
                        x = q.LONG(x) + o.tiffHeader;
                    }
                    y[G] = q.STRING(x, A - 1);
                    continue;

                  case 3:
                    if (A > 2) {
                        x = q.LONG(x) + o.tiffHeader;
                    }
                    for (F = 0; F < A; F++) {
                        E[F] = q.SHORT(x + F * 2);
                    }
                    break;

                  case 4:
                    if (A > 1) {
                        x = q.LONG(x) + o.tiffHeader;
                    }
                    for (F = 0; F < A; F++) {
                        E[F] = q.LONG(x + F * 4);
                    }
                    break;

                  case 5:
                    x = q.LONG(x) + o.tiffHeader;
                    for (F = 0; F < A; F++) {
                        E[F] = q.LONG(x + F * 4) / q.LONG(x + F * 4 + 4);
                    }
                    break;

                  case 9:
                    x = q.LONG(x) + o.tiffHeader;
                    for (F = 0; F < A; F++) {
                        E[F] = q.SLONG(x + F * 4);
                    }
                    break;

                  case 10:
                    x = q.LONG(x) + o.tiffHeader;
                    for (F = 0; F < A; F++) {
                        E[F] = q.SLONG(x + F * 4) / q.SLONG(x + F * 4 + 4);
                    }
                    break;

                  default:
                    continue;
                }
                D = A == 1 ? E[0] : E;
                if (t.hasOwnProperty(G) && typeof D != "object") {
                    y[G] = t[G][D];
                } else {
                    y[G] = D;
                }
            }
            return y;
        }
        function s() {
            var v = e, u = o.tiffHeader;
            q.II(q.SHORT(u) == 18761);
            if (q.SHORT(u += 2) !== 42) {
                return false;
            }
            o.IFD0 = o.tiffHeader + q.LONG(u += 2);
            v = p(o.IFD0, n.tiff);
            o.exifIFD = "ExifIFDPointer" in v ? o.tiffHeader + v.ExifIFDPointer : e;
            o.gpsIFD = "GPSInfoIFDPointer" in v ? o.tiffHeader + v.GPSInfoIFDPointer : e;
            return true;
        }
        function r(w, u, z) {
            var B, y, x, A = 0;
            if (typeof u === "string") {
                var v = n[w.toLowerCase()];
                for (hex in v) {
                    if (v[hex] === u) {
                        u = hex;
                        break;
                    }
                }
            }
            B = o[w.toLowerCase() + "IFD"];
            y = q.SHORT(B);
            for (i = 0; i < y; i++) {
                x = B + 12 * i + 2;
                if (q.SHORT(x) == u) {
                    A = x + 8;
                    break;
                }
            }
            if (!A) {
                return false;
            }
            q.LONG(A, z);
            return true;
        }
        return {
            init: function(u) {
                o = {
                    tiffHeader: 10
                };
                if (u === e || !u.length) {
                    return false;
                }
                q.init(u);
                if (q.SHORT(0) === 65505 && q.STRING(4, 5).toUpperCase() === "EXIF\0") {
                    return s();
                }
                return false;
            },
            EXIF: function() {
                var v;
                v = p(o.exifIFD, n.exif);
                if (v.ExifVersion && j.typeOf(v.ExifVersion) === "array") {
                    for (var w = 0, u = ""; w < v.ExifVersion.length; w++) {
                        u += String.fromCharCode(v.ExifVersion[w]);
                    }
                    v.ExifVersion = u;
                }
                return v;
            },
            GPS: function() {
                var u;
                u = p(o.gpsIFD, n.gps);
                if (u.GPSVersionID) {
                    u.GPSVersionID = u.GPSVersionID.join(".");
                }
                return u;
            },
            setExif: function(u, v) {
                if (u !== "PixelXDimension" && u !== "PixelYDimension") {
                    return false;
                }
                return r("exif", u, v);
            },
            getBinary: function() {
                return q.SEGMENT();
            }
        };
    }
})(window, document, plupload);