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
			//var ids = []
			
			topics.forEach(function(topic){
				topic.cover_photo = topic.cover_photo || 'default'
				//ids.push(topic.cover_photo)
			})
			/*
			Photo.find({_id: {'$in':ids}}).exec(function(err, photos){
				if (err) {
					res.jsonp([500, err])
				} else {
					photos.forEach(function(photo){
						photo.url = Photo.getPhotoUrl(photo)
					})
					
					res.jsonp([200, topics])
				}
			})
			*/
		}
	})
}

// 显示某一主题信息
control.show = function(req, res) {
	var topicid = req.params.topicid
	
	Topic.findOne({ _id: topicid}).exec(function(err, result) {
		if (err) {
			res.jsonp([500, err])
		} else if (!result) {
			res.jsonp([404, '主题不存在'])
		} else {
			res.jsonp([200, result]);
		}
	})
}


// 作者身份验证
control.auth = function(req, res, next) {
	var topicid = req.body.topicid
	Topic.findOne({ _id: topicid}).exec(function (err, result) {
		if (err) {
			res.jsonp([500, err])
		} else if (!result) {
			res.jsonp([404, '主题不存在'])
		} else if ( req.user._id === result.user_id ) {
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

// 更新主题
// 需验证作者身份
control.update = function(req, res) {
	
	var post = req.body
	var topicid = post.topicid
	
	post.photoList = _.isArray(post.photoList) ? post.photoList: [];
	
	Topic.update({_id: topicid}, {
		title: post.title
		, description: post.description
		, photo_count: post.photoList.length
		, updated_at: req.time
		, photos: photoList
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([400, '主题更新失败'])
			: res.jsonp([200, '主题更新成功'])
	})
}

/**
 * 删除主题
 * 同时彻底删除所属照片
 * 需验证作者身份
 */
control.destroy = function(req, res) {
	var topicid = req.query.topicid

	Topic.remove({_id: topicid}, function(err, numberAffected) {
		err ? res.jsonp([500, '主题删除失败'])
			: res.jsonp([200, '主题删除成功'])
	})
}

var topics = C('topics', control)
