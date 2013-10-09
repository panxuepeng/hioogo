var C = require("../common/index")
  , User = C.model('User')
  , Topic = C.model('Topic')
  , Photo = C.model('Photo')
  , utils = C.utils
  , auth = C.auth
  , _ = C._

var control = {};

// 显示主题列表
control.index = function(req, res) {
	
	Topic.find({status: 1})
	.skip(0)
	.limit(10)
	.exec(function (err, topics) {
		if (err) {
			res.jsonp([500, err])
		} else {
			res.jsonp([200, topics])
		}
	})
}

// 显示某一主题信息
control.show = function(req, res) {
	var topicid = req.params.topicid
	
	Topic.findOne({ _id: topicid}).exec(function(err, topics) {
		if (err) {
			res.jsonp([500, err])
		} else if (!topics) {
			res.jsonp([404, '主题不存在'])
		} else {
			topics.prototype = null
			// 获取图片数据
			// 这里碰到一个问题，具体原因尚不明确
			// topics photos等对象，不能动态的增减属性
			// 也就是说，要修改的属性必须是在model当中定义的属性
			Photo.find({_id: {'$in': topics.photos}, status:1})
			.sort({shooting_time: -1})
			.exec(function(err2, photos){
				photos.prototype = null
				_.each(photos, function(photo){
					photo.url = Photo.getPhotoUrl(photo)
				})
				
				topics.photos = photos
				topics.isauthor = true
				
				res.jsonp([200, topics])
			})
			
		}
	})
}


// 作者身份验证
control.auth = function(req, res, next) {
	var topicid = req.params.topicid || req.body.topicid || req.query.topicid
	
	Topic.findOne({ _id: topicid}).exec(function (err, result) {
		//console.log(typeof req.user._id, typeof result.user_id)
		if (err) {
			res.jsonp([500, err])
		} else if (!result) {
			res.jsonp([404, '主题不存在'])
		} else if ( req.user._id === result.user_id.toString() ) {
			next()
		} else {
			res.jsonp([403, '没有修改权限'])
		}
	})
}


// 创建主题
control.create = function(req, res) {
	var post = req.body
	var topicid = post.topicid
	var photoList = post.photoList
	photoList = _.isArray(photoList)? photoList: [];
	
	var data = {
		user_id: req.user._id
		, title: post.title
		, description: post.description
		, photo_count: photoList.length
		, created_at: req.time
		, updated_at: req.time
		, cover_photo: post.cover_photo
		, status: 1
		, photos: photoList
	};
	
	var topic = new Topic(data);

	topic.save(function (err, result) {
		err ? res.jsonp([500, '主题插入失败'])
			: res.jsonp([200, {topicid: result._id}]);
	})
}

// 修改主题
// 需验证作者身份
control.update = function(req, res) {
	
	var post = req.body
	var topicid = post.topicid
	var photoList = post.photoList
	photoList = _.isArray(photoList) ? photoList: [];
	
	Topic.update({_id: topicid}, {
		title: post.title
		, description: post.description
		, photo_count: post.photoList.length
		, cover_photo: post.cover_photo
		, updated_at: req.time
		, photos: photoList
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([400, '主题更新失败'])
			: res.jsonp([200, '主题更新成功'])
	})
}

// 推荐主题
// 需验证管理员身份
control.recommend = function(req, res) {
	var topicid = req.params.topicid
	Topic.update({_id: topicid}, {
		status: 1
		, updated_at: req.time
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([400, '主题推荐失败'])
			: res.jsonp([200, '主题推荐成功'])
	})
}

/**
 * 删除主题
 * 同时彻底删除所属本主题，且是主题作者的照片
 * 需验证作者身份
 */
control.destroy = function(req, res) {
	var topicid = req.params.topicid

	Topic.remove({_id: topicid}, function(err, numberAffected) {
		err ? res.jsonp([500, '主题删除失败', numberAffected])
			: res.jsonp([200, '主题删除成功', numberAffected])
	})
}

/**
 * 主题设置为删除状态
 * 此时仅修改状态 status = 0
 * 需验证作者身份
 */
control.del = function(req, res) {
	var topicid = req.params.topicid
	
	Topic.update({_id: topicid}, {
		status: 0
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([500, '主题删除失败', numberAffected])
			: res.jsonp([200, '主题删除成功', numberAffected])
	})
}

var topics = C('topics', control)
