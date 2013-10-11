var C = require("../common/index")
  , upload = require("./_upload")
  , User = C.model('User')
  , Photo = C.model('Photo')
  , utils = C.utils
  , auth = C.auth
  , async = C.async
  , _ = C._
  , config = process.appConfig
  
var control = {};

// 获取主题所属的图片信息
control.index = function(req, res) {
	var photoids = req.query.photoids
	var where
	
	if ( photoids && /\w{24,24}/i.test(photoids) ) {
		photoids = photoids.replace(/\s+/g, '')
		photoids = photoids.split(',')
		where = {_id: {'$in': photoids}}
	}
	
	
	Photo.find(where)
	.skip(0)
	.limit(10)
	.exec(function (err, result) {
		err ? res.jsonp([500, err])
			: res.jsonp([200, result])
	});
}

// 作者身份验证
control.auth = function(req, res, next) {
	var photoid = req.params.photoid || req.body.photoid || req.query.photoid
	
	Photo.findOne({ _id: photoid}).exec(function (err, result) {
		if (err) {
			res.jsonp([500, err])
		} else if (result && req.user._id === result.user_id.toString() ) {
			next()
		} else if (!result) {
			res.jsonp([404, '图片不存在'])
		} else if ( req.user._id !== result.user_id ) {
			res.jsonp([403, '没有修改权限'])
		}
	})
}

// 更新图片信息
control.update = function(req, res) {
	var post = req.body
	var photoid = post.photoid
	
	Photo.update({_id: photoid}, {
		description: post.description
		, updated_at: req.time
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([400, '更新失败'])
			: res.jsonp([200, '更新成功'])
	})
}

// 更新图片状态
control.del = function(req, res) {
	var photoid = req.params.photoid
	
	Photo.update({_id: photoid}, {
		status: -1
		, updated_at: req.time
	}, function(err, numberAffected, raw) {
		err ? res.jsonp([400, '更新失败'])
			: res.jsonp([200, '更新成功'])
	})
}

// 上传图片
// 客户端默认使用plupload
// 上传成功返回示例 {"id":"id","url":"url"}
// 上传失败返回示例 {"error":1,"msg":"Failed to save."}
control.upload = function(req, res) {
	//console.log(req.files)
	async.series( upload(req, res), function(err, result) {
		err ? res.jsonp({error:1, msg: err})
			: res.jsonp({id:result['insert'], url:result['write'] })
	})
}

// 删除图片
control.destroy = function(req, res) {
	var photoid = req.params.photoid

	Photo.remove({_id: photoid}, function(err, numberAffected) {
		err ? res.jsonp([500, err])
			: res.jsonp([200, '删除成功'])
	});
}

var photos = C('photos', control);