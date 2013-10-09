/**
 * 主题分类
 * 检查日期: 2013-10-09
 */

var mongoose = require('mongoose')
	, _ = require('underscore')

var schema = new mongoose.Schema({
	// 名称
	name: String,
	
	// 状态: 0删除 1正常
	status: { type: Number, default: 1 },
	
	// 创建时间
	created_at: {type : Date, default: Date.now},
	
	// 更新时间
	updated_at: {type : Date, default: Date.now}
})

/**
 * Methods
 */
schema.methods = {


}

schema.statics = {

}
mongoose.model('Category', schema)
