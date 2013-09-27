/*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */
define("arttemplate/2.0.1/arttemplate-debug", [], function(require, exports, module) {
    /**
 * ģ������·�ɺ���
 * ���ڶ�����������Ϊ Object ��ִ�� render ����, ���� compile ����
 * @name    template
 * @param   {String}            ģ��ID (��ѡ)
 * @param   {Object, String}    ���ݻ���ģ���ַ���
 * @return  {String, Function}  ��Ⱦ�õ�HTML�ַ���������Ⱦ����
 */
    var template = function(id, content) {
        return template[typeof content === "object" ? "render" : "compile"].apply(template, arguments);
    };
    (function(exports, global) {
        "use strict";
        exports.version = "2.0.1";
        exports.openTag = "<%";
        // �����߼��﷨��ʼ��ǩ
        exports.closeTag = "%>";
        // �����߼��﷨������ǩ
        exports.isEscape = true;
        // HTML�ַ��������򿪹�
        exports.isCompress = false;
        // �޳���Ⱦ��HTML�����Ŀհ׿���
        exports.parser = null;
        // �Զ����﷨�����ӿ�
        /**
 * ��Ⱦģ��
 * @name    template.render
 * @param   {String}    ģ��ID
 * @param   {Object}    ����
 * @return  {String}    ��Ⱦ�õ�HTML�ַ���
 */
        exports.render = function(id, data) {
            var cache = _getCache(id);
            if (cache === undefined) {
                return _debug({
                    id: id,
                    name: "Render Error",
                    message: "No Template"
                });
            }
            return cache(data);
        };
        /**
 * ����ģ��
 * 2012-6-6:
 * define ��������Ϊ compile,
 * �� Node Express ����һ��,
 * ��л TooBug �ṩ����!
 * @name    template.compile
 * @param   {String}    ģ��ID (��ѡ)
 * @param   {String}    ģ���ַ���
 * @return  {Function}  ��Ⱦ����
 */
        exports.compile = function(id, source) {
            var params = arguments;
            var isDebug = params[2];
            var anonymous = "anonymous";
            if (typeof source !== "string") {
                isDebug = params[1];
                source = params[0];
                id = anonymous;
            }
            try {
                var Render = _compile(source, isDebug);
            } catch (e) {
                e.id = id || source;
                e.name = "Syntax Error";
                return _debug(e);
            }
            function render(data) {
                try {
                    return new Render(data) + "";
                } catch (e) {
                    if (!isDebug) {
                        return exports.compile(id, source, true)(data);
                    }
                    e.id = id || source;
                    e.name = "Render Error";
                    e.source = source;
                    return _debug(e);
                }
            }
            render.prototype = Render.prototype;
            render.toString = function() {
                return Render.toString();
            };
            if (id !== anonymous) {
                _cache[id] = render;
            }
            return render;
        };
        /**
 * ����ģ�帨������
 * @name    template.helper
 * @param   {String}    ����
 * @param   {Function}  ����
 */
        exports.helper = function(name, helper) {
            exports.prototype[name] = helper;
        };
        /**
 * ģ�������¼�
 * @name    template.onerror
 * @event
 */
        exports.onerror = function(e) {
            var content = "[template]:\n" + e.id + "\n\n[name]:\n" + e.name;
            if (e.message) {
                content += "\n\n[message]:\n" + e.message;
            }
            if (e.line) {
                content += "\n\n[line]:\n" + e.line;
                content += "\n\n[source]:\n" + e.source.split(/\n/)[e.line - 1].replace(/^[\s\t]+/, "");
            }
            if (e.temp) {
                content += "\n\n[temp]:\n" + e.temp;
            }
            if (global.console) {
                console.error(content);
            }
        };
        // �����õĺ�������
        var _cache = {};
        // ��ȡģ�建��
        var _getCache = function(id) {
            var cache = _cache[id];
            if (cache === undefined && "document" in global) {
                var elem = document.getElementById(id);
                if (elem) {
                    var source = elem.value || elem.innerHTML;
                    return exports.compile(id, source.replace(/^\s*|\s*$/g, ""));
                }
            } else if (_cache.hasOwnProperty(id)) {
                return cache;
            }
        };
        // ģ��������
        var _debug = function(e) {
            exports.onerror(e);
            function error() {
                return error + "";
            }
            error.toString = function() {
                return "{Template Error}";
            };
            return error;
        };
        // ģ��������
        var _compile = function() {
            // ������������
            exports.prototype = {
                $render: exports.render,
                $escape: function(content) {
                    return typeof content === "string" ? content.replace(/&(?![\w#]+;)|[<>"']/g, function(s) {
                        return {
                            "<": "&#60;",
                            ">": "&#62;",
                            '"': "&#34;",
                            "'": "&#39;",
                            "&": "&#38;"
                        }[s];
                    }) : content;
                },
                $string: function(value) {
                    if (typeof value === "string" || typeof value === "number") {
                        return value;
                    } else if (typeof value === "function") {
                        return value();
                    } else {
                        return "";
                    }
                }
            };
            var arrayforEach = Array.prototype.forEach || function(block, thisObject) {
                var len = this.length >>> 0;
                for (var i = 0; i < len; i++) {
                    if (i in this) {
                        block.call(thisObject, this[i], i, this);
                    }
                }
            };
            // ��������
            var forEach = function(array, callback) {
                arrayforEach.call(array, callback);
            };
            // ��̬����ģ������
            var KEYWORDS = // �ؼ���
            "break,case,catch,continue,debugger,default,delete,do,else,false" + ",finally,for,function,if,in,instanceof,new,null,return,switch,this" + ",throw,true,try,typeof,var,void,while,with" + ",abstract,boolean,byte,char,class,const,double,enum,export,extends" + ",final,float,goto,implements,import,int,interface,long,native" + ",package,private,protected,public,short,static,super,synchronized" + ",throws,transient,volatile" + ",arguments,let,yield" + ",undefined";
            var REMOVE_RE = /\/\*(?:.|\n)*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|'[^']*'|"[^"]*"|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g;
            var SPLIT_RE = /[^\w$]+/g;
            var KEYWORDS_RE = new RegExp([ "\\b" + KEYWORDS.replace(/,/g, "\\b|\\b") + "\\b" ].join("|"), "g");
            var NUMBER_RE = /\b\d[^,]*/g;
            var BOUNDARY_RE = /^,+|,+$/g;
            var getVariable = function(code) {
                code = code.replace(REMOVE_RE, "").replace(SPLIT_RE, ",").replace(KEYWORDS_RE, "").replace(NUMBER_RE, "").replace(BOUNDARY_RE, "");
                code = code ? code.split(/,+/) : [];
                return code;
            };
            return function(source, isDebug) {
                var openTag = exports.openTag;
                var closeTag = exports.closeTag;
                var parser = exports.parser;
                var code = source;
                var tempCode = "";
                var line = 1;
                var uniq = {
                    $data: true,
                    $helpers: true,
                    $out: true,
                    $line: true
                };
                var helpers = exports.prototype;
                var prototype = {};
                var variables = "var $helpers=this," + (isDebug ? "$line=0," : "");
                var isNewEngine = "".trim;
                // '__proto__' in {}
                var replaces = isNewEngine ? [ "$out='';", "$out+=", ";", "$out" ] : [ "$out=[];", "$out.push(", ");", "$out.join('')" ];
                var concat = isNewEngine ? "if(content!==undefined){$out+=content;return content}" : "$out.push(content);";
                var print = "function(content){" + concat + "}";
                var include = "function(id,data){" + "if(data===undefined){data=$data}" + "var content=$helpers.$render(id,data);" + concat + "}";
                // html���߼��﷨����
                forEach(code.split(openTag), function(code, i) {
                    code = code.split(closeTag);
                    var $0 = code[0];
                    var $1 = code[1];
                    // code: [html]
                    if (code.length === 1) {
                        tempCode += html($0);
                    } else {
                        tempCode += logic($0);
                        if ($1) {
                            tempCode += html($1);
                        }
                    }
                });
                code = tempCode;
                // ��������
                if (isDebug) {
                    code = "try{" + code + "}catch(e){" + "e.line=$line;" + "throw e" + "}";
                }
                code = "'use strict';" + variables + replaces[0] + code + "return new String(" + replaces[3] + ")";
                try {
                    var Render = new Function("$data", code);
                    Render.prototype = prototype;
                    return Render;
                } catch (e) {
                    e.temp = "function anonymous($data) {" + code + "}";
                    throw e;
                }
                // ���� HTML ����
                function html(code) {
                    // ��¼�к�
                    line += code.split(/\n/).length - 1;
                    if (exports.isCompress) {
                        code = code.replace(/[\n\r\t\s]+/g, " ");
                    }
                    code = code.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
                    code = replaces[1] + "'" + code + "'" + replaces[2];
                    return code + "\n";
                }
                // �����߼�����
                function logic(code) {
                    var thisLine = line;
                    if (parser) {
                        // �﷨ת����������
                        code = parser(code);
                    } else if (isDebug) {
                        // ��¼�к�
                        code = code.replace(/\n/g, function() {
                            line++;
                            return "$line=" + line + ";";
                        });
                    }
                    // ��������. ת��: <%=value%> ��ת��:<%==value%>
                    if (code.indexOf("=") === 0) {
                        var isEscape = code.indexOf("==") !== 0;
                        code = code.replace(/^=*|[\s;]*$/g, "");
                        if (isEscape && exports.isEscape) {
                            // ת�崦�������ų���������
                            var name = code.replace(/\s*\([^\)]+\)/, "");
                            if (!helpers.hasOwnProperty(name) && !/^(include|print)$/.test(name)) {
                                code = "$escape($string(" + code + "))";
                            }
                        } else {
                            code = "$string(" + code + ")";
                        }
                        code = replaces[1] + code + replaces[2];
                    }
                    if (isDebug) {
                        code = "$line=" + thisLine + ";" + code;
                    }
                    getKey(code);
                    return code + "\n";
                }
                // ��ȡģ���еı�����
                function getKey(code) {
                    code = getVariable(code);
                    // �ִ�
                    forEach(code, function(name) {
                        // ����
                        if (!uniq.hasOwnProperty(name)) {
                            setValue(name);
                            uniq[name] = true;
                        }
                    });
                }
                // ����ģ������
                // ��ֵ���ȼ�:
                // ������Ȩ����(include, print) > ˽��ģ�帨������ > ���� > ����ģ�帨������
                function setValue(name) {
                    var value;
                    if (name === "print") {
                        value = print;
                    } else if (name === "include") {
                        prototype["$render"] = helpers["$render"];
                        value = include;
                    } else {
                        value = "$data." + name;
                        if (helpers.hasOwnProperty(name)) {
                            prototype[name] = helpers[name];
                            if (name.indexOf("$") === 0) {
                                value = "$helpers." + name;
                            } else {
                                value = value + "===undefined?$helpers." + name + ":" + value;
                            }
                        }
                    }
                    variables += name + "=" + value + ",";
                }
            };
        }();
    })(template, this);
    module.exports = template;
});