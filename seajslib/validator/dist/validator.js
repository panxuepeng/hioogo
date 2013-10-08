define("validator/1.2.0/validator", [], function(require, exports) {});

/*! Validator.js
 * @author: sofish https://github.com/sofish
 * @copyright: MIT license */
// Լ������ /\$\w+/ ��ʾ���ַ������� $item ��ʾ����һ�� jQuery Object
~function($) {
    var patterns, fields, errorElement, addErrorClass, removeErrorClass, novalidate, validateForm, validateFields, radios, removeFromUnvalidFields, asyncValidate, getVal, aorbValidate, validateReturn, unvalidFields = [];
    // �����ж�
    patterns = {
        // ��ǰУ����Ԫ�أ�Ĭ��û�У��� `validate()` �����д���
        // $item: {},
        email: function(text) {
            return /^(?:[a-z0-9]+[_\-+.]?)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i.test(text);
        },
        // ��֧�� 8 �����͵� day
        // 20120409 | 2012-04-09 | 2012/04/09 | 2012.04.09 | ���ϸ����� 0 ��״��
        date: function(text) {
            var reg = /^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/, taste, d;
            if (!reg.test(text)) return false;
            taste = reg.exec(text);
            year = +taste[1], month = +taste[3] - 1, day = +taste[5];
            d = new Date(year, month, day);
            return year === d.getFullYear() && month === d.getMonth() && day === d.getDate();
        },
        // �ֻ������й��ֻ���Ӧ���� 1 ��ͷ���ڶ�λ�� 3-9��������λ��Ϊ 11 λ����
        mobile: function(text) {
            return /^1[3-9]\d{9}$/.test(text);
        },
        // ���������й�����֧�֣����ſ��� 3��4λ�������� 0 ��ͷ���绰�Ų��� 0 ��ͷ���� 8 λ�������� 7 λ��
        //  �� 400/800 ��ͷ���⣬��Ӧ�绰���绰������ 7 λ��
        // 0755-29819991 | 0755 29819991 | 400-6927972 | 4006927927 | 800...
        tel: function(text) {
            return /^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/.test(text);
        },
        number: function(text) {
            var min = +this.$item.attr("min"), max = +this.$item.attr("max"), result = /^\-?(?:[1-9]\d*|0)(?:[.]\d)?$/.test(text), text = +text, step = +this.$item.attr("step");
            // ignore invalid range silently
            isNaN(min) && (min = text - 1);
            isNaN(max) && (max = text + 1);
            // Ŀǰ��ʵ�� step ����С�� 0
            return result && (isNaN(step) || 0 >= step ? text >= min && text <= max : 0 === (text + min) % step && text >= min && text <= max);
        },
        // �ж��Ƿ��� min / max ֮��
        range: function(text) {
            return this.number(text);
        },
        // ֧������:
        // http(s)://(username:password@)(www.)domain.(com/co.uk)(/...)
        // (s)ftp://(username:password@)domain.com/...
        // git://(username:password@)domain.com/...
        // irc(6/s)://host:port/... // ��Ҫ����
        // afp over TCP/IP: afp://[<user>@]<host>[:<port>][/[<path>]]
        // telnet://<user>:<password>@<host>[:<port>/]
        // smb://[<user>@]<host>[:<port>][/[<path>]][?<param1>=<value1>[;<param2>=<value2>]]
        url: function(text) {
            var protocols = "((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?", userInfo = "([a-z0-9]\\w*(\\:[\\S]+)?\\@)?", domain = "([a-z0-9]([\\w]*[a-z0-9])*\\.)?[a-z0-9]\\w*\\.[a-z]{2,}(\\.[a-z]{2,})?", port = "(:\\d{1,5})?", ip = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", address = "(\\/\\S*)?", domainType = [ protocols, userInfo, domain, port, address ], ipType = [ protocols, userInfo, ip, port, address ], validate;
            validate = function(type) {
                return new RegExp("^" + type.join("") + "$", "i").test(text);
            };
            return validate(domainType) || validate(ipType);
        },
        // ������Ŀǰֻ�ǲ�Ϊ�վ� ok�������Զ���
        password: function(text) {
            return this.text(text);
        },
        checkbox: function() {
            return patterns._checker("checkbox");
        },
        // radio ���ݵ�ǰ radio �� name ���Ի�ȡԪ�أ�ֻҪ name ��ͬ���⼸��Ԫ������һ�� checked������֤�ѹ�
        radio: function(checkbox) {
            $item = $(checkbox);
            return patterns._checker("radio");
        },
        _checker: function(type) {
            // TODO: a better way?!
            var form = this.$item.parents("form").eq(0), identifier = "input:" + type + '[name="' + this.$item.attr("name") + '"]', result = false, $items = $(identifier, form);
            // TODO: a faster way?!
            $items = $items.filter("[required]");
            if (!$items.length) {
                result = true;
            }
            $items.each(function(i, item) {
                if (item.checked && !result) return result = true;
            });
            return result;
        },
        // text[notEmpty] �����Ϊ��
        // [type=text] Ҳ��������
        text: function(text) {
            var max = parseInt(this.$item.attr("maxlength"), 10), noEmpty;
            notEmpty = function(text) {
                return !!text.length && !/^\s+$/.test(text);
            };
            return isNaN(max) ? notEmpty(text) : notEmpty(text) && text.length <= max;
        }
    };
    // �첽��֤
    asyncValidate = function($item, klass, isErrorOnParent) {
        var data = $item.data(), url = data["url"], method = data["method"] || "get", key = data["key"] || "key", text = getVal($item), params = {};
        params[key] = text;
        $[method](url, params).success(function(isValidate) {
            var message = isValidate ? "IM VALIDED" : "unvalid";
            return validateReturn.call(this, $item, klass, isErrorOnParent, message);
        }).error(function() {});
    };
    // ��ѡһ���������б�����һ�������Ѿ���
    // <input data-aorb="a" >
    // <input data-aorb="b" >
    aorbValidate = function($item, klass, isErrorOnParent) {
        var id = $item.data("aorb") === "a" ? "b" : "a", $pair = $("[data-aorb=" + id + "]", $item.parents("form").eq(0)), a = [ $item, klass, isErrorOnParent ], b = [ $pair, klass, isErrorOnParent ], result = 0;
        result += validateReturn.apply(this, a) ? 0 : 1;
        result += validateReturn.apply(this, b) ? 0 : 1;
        result = result > 0 ? (removeErrorClass.apply(this, a), removeErrorClass.apply(this, b), 
        false) : validateReturn.apply(this, a.concat("unvalid"));
        // ͨ���򷵻� false
        return result;
    };
    // ��֤���ķ���ֵ
    validateReturn = function($item, klass, parent, message) {
        if (!$item) return "DONT VALIDATE UNEXIST ELEMENT";
        var pattern, type, val, ret, event;
        pattern = $item.attr("pattern");
        required = $item.is("[required]");
        pattern && pattern.replace("\\", "\\\\");
        type = $item.data("type") || $item.attr("type") || "text";
        // hack ie: �� select �� textarea ���ص� type ��Ϊ NODENAME ���ǿ�
        type = patterns[type] ? type : "text";
        val = $.trim(getVal($item));
        event = $item.data("event");
        // HTML5 pattern ֧��
        message = message ? message : pattern ? new RegExp(pattern).test(val) || "unvalid" : patterns[type](val) || "unvalid";
        // ���صĴ������� = {
        //    $el: {jQuery Element Object} // ��ǰ������
        //  , type: {String} //���������ͣ��� [type=radio]
        //  , message: {String} // error message��ֻ������ֵ
        // }
        // NOTE: �� jQuery Object ���� trigger ��������Ϊ������������ԭ���� DOM Object
        if (message === "unvalid") removeErrorClass($item, klass, parent);
        var isError = /^(?:unvalid|empty)$/.test(message);
        if (!required && !val) {
            isError = false;
        }
        return isError ? (ret = {
            $el: addErrorClass.call(this, $item, klass, parent, message),
            type: type,
            error: message
        }, $item.trigger("after:" + event, $item), ret) : (removeErrorClass.call(this, $item, klass, parent), 
        $item.trigger("after:" + event, $item), false);
    };
    // ��ȡ��У������
    fields = function(identifie, form) {
        return $(identifie, form);
    };
    // ��ȡ��У������ֵ
    getVal = function($item) {
        return $item.val() || ($item.is("[contenteditable]") ? $item.text() : "");
    };
    // У��һ��������
    // ����ʱ����һ�����󣬵�ǰ�����������ͣ�ͨ��ʱ���� false
    validate = function($item, klass, parent) {
        var async, aorb, type, val, commonArgs, event;
        // �ѵ�ǰԪ�طŵ� patterns �����б���
        patterns.$item = $item;
        type = $item.attr("type");
        val = getVal($item);
        async = $item.data("url");
        aorb = $item.data("aorb");
        event = $item.data("event");
        commonArgs = [ $item, klass, parent ];
        // ��ָ�� `data-event` ��ʱ���ڼ���ǰ�����Զ����¼�
        // NOTE: �� jQuery Object ���� trigger ��������Ϊ������������ԭ���� DOM Object
        event && $item.trigger("before:" + event, $item);
        // ���ж����Ȳ����ǲ��� empty��checkbox �ǿ�����ֵ
        // ��ͨ����˵���Ǹ���Ҫ���� checked ��״̬
        // ��ʱȥ�� radio/checkbox/linkage/aorb �� notEmpty ����
        if (!(/^(?:radio|checkbox)$/.test(type) || aorb) && !patterns["text"](val)) return validateReturn.call(this, $item, klass, parent, "empty");
        // ��ѡһ��֤���п���Ϊ��
        if (aorb) return aorbValidate.apply(this, commonArgs);
        // �첽��֤�򲻽�����ͨ��֤
        if (async) return asyncValidate.apply(this, commonArgs);
        // ������֤����ֵ
        return validateReturn.call(this, $item, klass, parent);
    };
    // У��������
    validateFields = function($fields, method, klass, parent) {
        // TODO������ delegate �ķ�ʽ��
        var reSpecialType = /^radio|checkbox/, field;
        $.each($fields, function(i, f) {
            var $f = $(f);
            $f[$f.on ? "on" : "bind"](reSpecialType.test(f.type) || "SELECT" === f.tagName ? "change blur" : method, function() {
                // �����д��󣬷��صĽ�����һ�����󣬴��� validedFields ���ṩ������ `validateForm`
                var $items = $(this);
                if (reSpecialType.test(this.type)) {
                    $items = $("input[type=" + this.type + "][name=" + this.name + "]", $items.closest("form"));
                }
                $items.each(function() {
                    (field = validate.call(this, $(this), klass, parent)) && unvalidFields.push(field);
                });
            });
        });
    };
    // У������������ͨ��ʱ���� false����Ȼ�������г����Ķ���
    validateForm = function($fields, method, klass, parent) {
        if (method && !validateFields.length) return true;
        unvalidFields = $.map($fields, function(el) {
            var field = validate.call(null, $(el), klass, parent);
            if (field) return field;
        });
        return validateFields.length ? unvalidFields : false;
    };
    // �� unvalidField ��ɾ��
    removeFromUnvalidFields = function($item) {
        var obj, index;
        // �� unvalidFields ��ɾ��
        obj = $.grep(unvalidFields, function(item) {
            return item["$el"] = $item;
        })[0];
        if (!obj) return;
        index = $.inArray(obj, unvalidFields);
        unvalidFields.splice(index, 1);
        return unvalidFields;
    };
    // ����/ɾ������ class
    // @param `$item` {jQuery Object} ������ element
    // @param [optional] `klass` {String} ��һ�� class Ĭ��ֵ�� `error`
    // @param [optional] `parent` {Boolean} Ϊ true ��ʱ����class �������ڵ�ǰ����Ԫ�ص� parentNode ��
    errorElement = function($item, parent) {
        return $item.data("parent") ? $item.closest($item.data("parent")) : parent ? $item.parent() : $item;
    };
    addErrorClass = function($item, klass, parent, emptyClass) {
        return errorElement($item, parent).addClass(klass + " " + emptyClass);
    };
    removeErrorClass = function($item, klass, parent) {
        removeFromUnvalidFields.call(this, $item);
        return errorElement($item, parent).removeClass(klass + " empty unvalid");
    };
    // ���� `novalidate` �� form �У���ֹ������Ĭ�ϵ�У�飨��ʽ��һ�²���̫����
    novalidate = function($form) {
        return $form.attr("novalidate") || $form.attr("novalidate", "true");
    };
    // �����Ĳ����߼���ʼ��yayayayayayaya!
    // �÷���$form.validator(options)
    // ������options = {
    //    identifie: {String}, // ��ҪУ���ı������Ĭ���� `[required]`��
    //    klass: {String}, // У�鲻ͨ��ʱ����ʱ���ӵ� class ����Ĭ���� `error`��
    //    isErrorOnParent: {Boolean} // ��������ʱ class ���ڵ�ǰ������ǣ�Ĭ���� element ������
    //    method: {String | false}, // ����������У���ķ��������� false �ڵ� submit ��ť֮ǰ��У�飨Ĭ���� `blur`��
    //    errorCallback(unvalidFields): {Function}, // ����ʱ�� callback����һ�������ǳ����ı������
    //
    //    before: {Function}, // ��������֮ǰ
    //    after: {Function}, // ����У��֮����ֻ�з��� True �����ſ��ܱ��ύ
    //  }
    $.fn.validator = function(options) {
        var $form = this, options = options || {}, identifie = options.identifie || ":input", klass = options.error || "error", isErrorOnParent = options.isErrorOnParent || true, method = options.method || "blur", before = options.before || function() {
            return true;
        }, after = options.after || function() {
            return true;
        }, errorCallback = options.errorCallback || function(fields) {}, $items = fields(identifie, $form);
        // ��ֹ������Ĭ��У��
        novalidate($form);
        // ������У��
        method && validateFields.call(this, $items, method, klass, isErrorOnParent);
        // ���û��۽���ĳ������ʱȥ��������ʾ
        $form[$form.on ? "on" : "bind"]("focusin", identifie, function(e) {
            removeErrorClass.call(this, $(this), "error unvalid empty", isErrorOnParent);
        });
        // �ύУ��
        $form[$form.on ? "on" : "bind"]("submit", function(e) {
            before.call(this, $items);
            validateForm.call(this, $items, method, klass, isErrorOnParent);
            // ��ָ�� options.after ��ʱ����ֻ�е� after ���� true �����Ż��ύ
            return unvalidFields.length ? (e.preventDefault(), errorCallback.call(this, unvalidFields)) : after.call(this, e, $items) && true;
        });
    };
}(jQuery);