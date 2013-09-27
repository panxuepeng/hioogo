define(function(require, exports, module){
	var basePath = 'http://localhost:8080/';
	exports.version = '0.1.0'
	exports.base = basePath
	exports.cache = {
		reset: function(){
			this.topic = {}
			this.topiclist = {}
		},
		topic: {}, // 主题缓存
		topiclist: {} // 主题缓存
	}

	// 是否登录
	exports.logined = false;

	// 图片播放器
	exports.player = 'default.player';

	// 默认首页
	exports.index = 'photolist';
	
	// 当前的action
	exports.action = 'photolist';

	// 时间戳
	exports.timestamp = (+ new Date);

	// 公共js
	exports.commonScript = [];

	// 页面资源
	// 1: 普通页面
	// 2: 需检查登录状态的页面
	exports.pages = {
		'photo':1,
		'photolist':1,
		'login':1,
		'post':2 
	};

	// 页面js版本号
	exports.actionVersion = {

	}

	// 页面模板版本号
	exports.tmplVersion = {

	}

	exports.go = function( url ){
		location = url;
	}

	exports.home = function( name ){
		return '/#/photolist';
	}

	exports.hashLink = function( name ){
		return '/#/'+name;
	}

	exports.link = function( name ){
		return '/#/'+name;
	} 

	exports.serverLink = function( path ){
		return '/'+path;
	}

	exports.getTmplPath = function( name ){
		var v = exports.tmplVersion;
		var url = basePath+"/tmpl/"+name+".html".replace(/[\/]+/g, '/');

		if( seajs.debug ){
			url += '?'+(new Date);
		}else if( v[name] ){
			url += '?'+v[name];
		}
		return url;
	}
});