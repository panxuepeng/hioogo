/* 2013-10-08 */
define("validator/1.2.0/validator",[],function(){}),~function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o=[];b={email:function(a){return/^(?:[a-z0-9]+[_\-+.]?)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/i.test(a)},date:function(a){var b,c,d=/^([1-2]\d{3})([-/.])?(1[0-2]|0?[1-9])([-/.])?([1-2]\d|3[01]|0?[1-9])$/;return d.test(a)?(b=d.exec(a),year=+b[1],month=+b[3]-1,day=+b[5],c=new Date(year,month,day),year===c.getFullYear()&&month===c.getMonth()&&day===c.getDate()):!1},mobile:function(a){return/^1[3-9]\d{9}$/.test(a)},tel:function(a){return/^(?:(?:0\d{2,3}[- ]?[1-9]\d{6,7})|(?:[48]00[- ]?[1-9]\d{6}))$/.test(a)},number:function(a){var b=+this.$item.attr("min"),c=+this.$item.attr("max"),d=/^\-?(?:[1-9]\d*|0)(?:[.]\d)?$/.test(a),a=+a,e=+this.$item.attr("step");return isNaN(b)&&(b=a-1),isNaN(c)&&(c=a+1),d&&(isNaN(e)||0>=e?a>=b&&c>=a:0===(a+b)%e&&a>=b&&c>=a)},range:function(a){return this.number(a)},url:function(a){var b,c="((https?|s?ftp|irc[6s]?|git|afp|telnet|smb):\\/\\/)?",d="([a-z0-9]\\w*(\\:[\\S]+)?\\@)?",e="([a-z0-9]([\\w]*[a-z0-9])*\\.)?[a-z0-9]\\w*\\.[a-z]{2,}(\\.[a-z]{2,})?",f="(:\\d{1,5})?",g="\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}",h="(\\/\\S*)?",i=[c,d,e,f,h],j=[c,d,g,f,h];return b=function(b){return new RegExp("^"+b.join("")+"$","i").test(a)},b(i)||b(j)},password:function(a){return this.text(a)},checkbox:function(){return b._checker("checkbox")},radio:function(c){return $item=a(c),b._checker("radio")},_checker:function(b){var c=this.$item.parents("form").eq(0),d="input:"+b+'[name="'+this.$item.attr("name")+'"]',e=!1,f=a(d,c);return f=f.filter("[required]"),f.length||(e=!0),f.each(function(a,b){return b.checked&&!e?e=!0:void 0}),e},text:function(a){var b=parseInt(this.$item.attr("maxlength"),10);return notEmpty=function(a){return!!a.length&&!/^\s+$/.test(a)},isNaN(b)?notEmpty(a):notEmpty(a)&&a.length<=b}},k=function(b,c,d){var e=b.data(),f=e.url,g=e.method||"get",h=e.key||"key",i=l(b),j={};j[h]=i,a[g](f,j).success(function(a){var e=a?"IM VALIDED":"unvalid";return n.call(this,b,c,d,e)}).error(function(){})},m=function(b,c,d){var e="a"===b.data("aorb")?"b":"a",g=a("[data-aorb="+e+"]",b.parents("form").eq(0)),h=[b,c,d],i=[g,c,d],j=0;return j+=n.apply(this,h)?0:1,j+=n.apply(this,i)?0:1,j=j>0?(f.apply(this,h),f.apply(this,i),!1):n.apply(this,h.concat("unvalid"))},n=function(c,d,g,h){if(!c)return"DONT VALIDATE UNEXIST ELEMENT";var i,j,k,m,n;i=c.attr("pattern"),required=c.is("[required]"),i&&i.replace("\\","\\\\"),j=c.data("type")||c.attr("type")||"text",j=b[j]?j:"text",k=a.trim(l(c)),n=c.data("event"),h=h?h:i?new RegExp(i).test(k)||"unvalid":b[j](k)||"unvalid","unvalid"===h&&f(c,d,g);var o=/^(?:unvalid|empty)$/.test(h);return required||k||(o=!1),o?(m={$el:e.call(this,c,d,g,h),type:j,error:h},c.trigger("after:"+n,c),m):(f.call(this,c,d,g),c.trigger("after:"+n,c),!1)},c=function(b,c){return a(b,c)},l=function(a){return a.val()||(a.is("[contenteditable]")?a.text():"")},validate=function(a,c,d){var e,f,g,h,i,j;return b.$item=a,g=a.attr("type"),h=l(a),e=a.data("url"),f=a.data("aorb"),j=a.data("event"),i=[a,c,d],j&&a.trigger("before:"+j,a),/^(?:radio|checkbox)$/.test(g)||f||b.text(h)?f?m.apply(this,i):e?k.apply(this,i):n.call(this,a,c,d):n.call(this,a,c,d,"empty")},i=function(b,c,d,e){var f,g=/^radio|checkbox/;a.each(b,function(b,h){var i=a(h);i[i.on?"on":"bind"](g.test(h.type)||"SELECT"===h.tagName?"change blur":c,function(){var b=a(this);g.test(this.type)&&(b=a("input[type="+this.type+"][name="+this.name+"]",b.closest("form"))),b.each(function(){(f=validate.call(this,a(this),d,e))&&o.push(f)})})})},h=function(b,c,d,e){return c&&!i.length?!0:(o=a.map(b,function(b){var c=validate.call(null,a(b),d,e);return c?c:void 0}),i.length?o:!1)},j=function(b){var c,d;return(c=a.grep(o,function(a){return a.$el=b})[0])?(d=a.inArray(c,o),o.splice(d,1),o):void 0},d=function(a,b){return a.data("parent")?a.closest(a.data("parent")):b?a.parent():a},e=function(a,b,c,e){return d(a,c).addClass(b+" "+e)},f=function(a,b,c){return j.call(this,a),d(a,c).removeClass(b+" empty unvalid")},g=function(a){return a.attr("novalidate")||a.attr("novalidate","true")},a.fn.validator=function(b){var d=this,b=b||{},e=b.identifie||":input",j=b.error||"error",k=b.isErrorOnParent||!0,l=b.method||"blur",m=b.before||function(){return!0},n=b.after||function(){return!0},p=b.errorCallback||function(){},q=c(e,d);g(d),l&&i.call(this,q,l,j,k),d[d.on?"on":"bind"]("focusin",e,function(){f.call(this,a(this),"error unvalid empty",k)}),d[d.on?"on":"bind"]("submit",function(a){return m.call(this,q),h.call(this,q,l,j,k),o.length?(a.preventDefault(),p.call(this,o)):n.call(this,a,q)&&!0})}}(jQuery);