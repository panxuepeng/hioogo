/**
 * 用户 Collection 
 * 检查日期: 2013-09-10
 */

var mongoose = require('mongoose')
	, _ = require('underscore')
	, Schema = mongoose.Schema

var UserSchema = new Schema({
	username: { type: String, unique: true }
	// 用户的密码是两次md5，客户端一次，服务端一次
	, password: String
	// role: 0普通用户 1待审拍摄员 2拍摄员 5免审拍摄员 8系统管理员
	, role: { type: Number, default: 0 }
	, created_at: {type : Date, default: Date.now}
	, updated_at: {type : Date, default: Date.now}
	// 状态: 0删除 -1待审 1正常
	, status: { type: Number, default: 1 }
	, profile: {
		name: String
		, mobile: String
		, qq: String
		, profession: String
		, city: String
	}
	, questions: [{ question: String, answer: String }]
})

/**
 * Methods
 */
UserSchema.methods = {


}

UserSchema.statics = {
	validate: function(post) {
		
	}
	, validateSecure: function(post) {
		var data = []
		data = post
		return data
	}
	, validateProfile: function(profile) {
		var data = {}
		var fn = function (key, len) {
			len = len || 50
			if (profile[key]) {
				data[key] = profile[key].substr(0, len)
			}
		}
		
		if (profile && _.isObject(profile) ) {
			fn('name')
			fn('mobile')
			fn('qq')
			fn('profession')
			fn('city')
		}
		return data
	}
}
mongoose.model('User', UserSchema)
