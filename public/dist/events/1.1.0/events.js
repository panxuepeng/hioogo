/* 2013-10-05 */
define("events/1.1.0/events",[],function(){function a(){}function b(a,b,c){if(a){var d=0,e=a.length,f=b[0],g=b[1],h=b[2],i=!0;switch(b.length){case 0:for(;e>d;d+=2)i=a[d].call(a[d+1]||c)!==!1&&i;break;case 1:for(;e>d;d+=2)i=a[d].call(a[d+1]||c,f)!==!1&&i;break;case 2:for(;e>d;d+=2)i=a[d].call(a[d+1]||c,f,g)!==!1&&i;break;case 3:for(;e>d;d+=2)i=a[d].call(a[d+1]||c,f,g,h)!==!1&&i;break;default:for(;e>d;d+=2)i=a[d].apply(a[d+1]||c,b)!==!1&&i}}return i}function c(a){return"[object Function]"===Object.prototype.toString.call(a)}var d=/\s+/;a.prototype.on=function(a,b,c){var e,f,g;if(!b)return this;for(e=this.__events||(this.__events={}),a=a.split(d);f=a.shift();)g=e[f]||(e[f]=[]),g.push(b,c);return this},a.prototype.once=function(a,b,c){var d=this,e=function(){d.off(a,e),b.apply(this,arguments)};this.on(a,e,c)},a.prototype.off=function(a,b,c){var f,g,h,i;if(!(f=this.__events))return this;if(!(a||b||c))return delete this.__events,this;for(a=a?a.split(d):e(f);g=a.shift();)if(h=f[g])if(b||c)for(i=h.length-2;i>=0;i-=2)b&&h[i]!==b||c&&h[i+1]!==c||h.splice(i,2);else delete f[g];return this},a.prototype.trigger=function(a){var c,e,f,g,h,i,j=[],k=!0;if(!(c=this.__events))return this;for(a=a.split(d),h=1,i=arguments.length;i>h;h++)j[h-1]=arguments[h];for(;e=a.shift();)(f=c.all)&&(f=f.slice()),(g=c[e])&&(g=g.slice()),k=b(g,j,this)&&k,k=b(f,[e].concat(j),this)&&k;return k},a.prototype.emit=a.prototype.trigger,a.mixTo=function(b){b=c(b)?b.prototype:b;var d=a.prototype;for(var e in d)d.hasOwnProperty(e)&&(b[e]=d[e])};var e=Object.keys;return e||(e=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b}),a});