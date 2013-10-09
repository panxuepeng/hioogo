/**
 * 网站设置 Collection 
 * 检查日期: 2013-10-09
 */

var mongoose = require('mongoose')
	, _ = require('underscore')

var schema = new mongoose.Schema({
	// 网站名称
	title: String,
	
	// 状态: 0关闭 1正常
	status: { type: Number, default: 1 },
	
	// 同IP限制，0不限制
	limit: {
		// 访问
		access: {
			minute: { type: Number, default: 0 },
			hour: { type: Number, default: 0 },
			day: { type: Number, default: 0 }
		},
		
		// 注册
		register: {
			minute: { type: Number, default: 0 },
			hour: { type: Number, default: 0 },
			day: { type: Number, default: 0 }
		},
		
		// 上传图片
		upload: {
			minute: { type: Number, default: 0 },
			hour: { type: Number, default: 0 },
			day: { type: Number, default: 0 }
		}
		
	},
	
	// 主题分类
	categorys: Array,
	
	// 网站创建时间
	created_at: {type : Date, default: Date.now},
	
	// 设置更新时间
	updated_at: {type : Date, default: Date.now}
})

/**
 * Methods
 */
schema.methods = {

}

schema.statics = {

}
mongoose.model('Setting', schema)
