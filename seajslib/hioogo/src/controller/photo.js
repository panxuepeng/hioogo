define(function(require, exports, module){
	var Config = require('../config')
	, common = require('../common')
	, photoPlayer = null
	, template = require('template')
	, currentTopicid = ''
	, dom = $(document)

	require.async('../player/'+Config.player, function( player ) {
		photoPlayer = player
	});

	exports.show = function( id ){
		id = id || 1
		currentTopicid = id

		if( Config.cache.topic[id] ) {
			initData(Config.cache.topic[id])
		} else {
			$.getJSON(Config.serverLink('topics/'+id), function(data){
				if (data[0] === 200) {
					initData(data[1])
					Config.cache.topic[currentTopicid] = data[1]
				} else {
					seajs.log(data)
				}
			});
		}
	}
	
	// 编辑图片描述
	exports['on-photoedit'] = function($el) {
		var html = template.render('tmpl-photo-edit', getEditTmplData($el))
		common.dialog({
			title: '编辑照片描述',
			width: 600,
			content: html,
			onshown: function( dialog ){
				// 在弹出显示时
				// 如果文本框是空的，将光标定位到文本框
				var o = dialog.find('textarea')
				if( !$.trim(o.val()) ) o.focus()
			},
			onok: function( dialog ){
				postPhotoDesc( dialog )
			}
			
		})
	}
	
	// 编辑主题
	exports['on-topicedit'] = function() {
		location = '/#/post/'+currentTopicid
	}

	// 删除主题
	exports['on-topicremove'] = function(o) {
		if( confirm('确认删除此主题和其所有照片吗？') ){
			var url = Config.serverLink('topics/'+currentTopicid)
			
			$.ajax({
				type: 'DELETE'
				, dateType: 'json'
				, url: url
			}).success(function( result ){
				if( result[0] === 200 ){
					// 删除主题的缓存信息
					Config.cache.topic[currentTopicid] = null
					Config.go( Config.home() )
				} else {
					alert(result[1])
				}
			}).error(function(xhr, status){
				alert('出现错误，请稍候再试。')
			})
		}
	}
	
	// 推荐主题
	exports['on-topicrecommend'] = function(o) {
		var url = Config.serverLink('topics/recommend/'+currentTopicid)
		$.ajax({
			type: 'PUT'
			, dateType: 'json'
			, url: url
		}).success(function( result ){
			if( result[0] === 200 ){
				
			}
			
			common.dialog({
				content: result[1]
			});

		}).error(function(xhr, status){
			alert('出现错误，请稍候再试。')
		})
	}
	
	// 删除照片
	exports['on-photoremove'] = function(o) {
		if( confirm('确认彻底删除此照片吗？') ){
			var photo = o.closest('li[id^=photo]')
			photo.hide()
			
			var url = Config.serverLink('photos/'+o.attr('photoid'))
			$.ajax({
				type: 'DELETE'
				, dateType: 'json'
				, url: url
			}).success(function( result ){
				if( result[0] === 200 ){
					// 删除主题的照片信息
					
				} else {
					alert(result[1])
					photo.show()
				}
			}).error(function(xhr, status){
				alert('出现错误，请稍候再试。')
				photo.show()
			})
		}
	}
	
	exports.init = function( id ){
		// init ...
		
		// [显示/隐藏]编辑按钮
		dom.on('mouseover.photo', '.thumbnail', function(){
			$(this).find('.photo_edit').show()
		}).on('mouseleave.photo', '.thumbnail', function(){
			$(this).find('.photo_edit').hide()
		})

		common.lazyload()
	}

	function initData(data){
		var html = '';
		
		if( data && typeof data === 'object' ) {
			html = template.render('tmpl-photoview', data)
		}
		
		$("#photoview").html( html )
		setTimeout(function(){
			if (Config.cache.user.role === 8) {
				$('#topic-recommend').css({display: 'inline-block'});
			}
			photoPlayer.init()
		}, 0);
		common.trigger('afterinit')
	}

	function getEditTmplData( btn ){
		var	img = btn.closest('.thumbnail').find('img'),
			src = img.attr('src'),
			photoid = img.attr('photoid'),
			shooting_time = img.attr('shooting_time'),
			description = img.attr('description')
			
		return {
			photosrc: src,
			topicid: currentTopicid,
			photoid: photoid,
			shooting_time: shooting_time,
			description: description
		}
	}

	// 提交照片描述
	function postPhotoDesc( dialog ){
		var data = dialog.find('form').serialize();
		var photoid = dialog.find(":hidden[name=photoid]").val()
		var url = Config.serverLink('photos/'+photoid)
		$.ajax({
			type: 'PUT'
			, data: data
			, dateType: 'json'
			, url: url
		}).success(function( result ){
			if( result[0] === 200 ){
				var description = dialog.find('textarea').val()
				
				// 将编辑后的描述信息，写到照片属性上
				$("img[photoid="+photoid+"]").attr('description', description)
				
				$("#description-"+photoid).text(description)
				
				// 关闭窗口
				common.dialog.close()
			}else{
				alert(result[1])
			}
		}).error(function(xhr, status){
			alert('出现错误，请稍候再试。')
		})
	}

	// 删除照片
	function remove( action, photoid ){
		action = action || 'remove-photo'
		photoid = photoid || 0
		var data = {action: action, topicid: currentTopicid, photoid: photoid}
		
		$.post(Config.serverLink('photo/remove'), data, function( result ){
			if( result[0] === 200 ){
				
			}else{
				$("#photo-"+photoid).show()
			}
		}, 'json').error(function(xhr, status){
			$("#photo-"+photoid).show()
		});
	}
});
