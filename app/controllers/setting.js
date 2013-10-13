var C = require("../common/index")
  , Setting = C.model('Setting')
  , utils = C.utils
  , auth = C.auth
  , config = C.config

var setting = C('setting', {
	website: function(req, res) {
		Setting.findOne().exec(function (err, result) {
			if (err) {
				res.jsonp([500, err])
			} else if (result){
				var data = {
					title: result.title
					, created_at: result.created_at
					, updated_at: result.updated_at
					, status: result.status
					, categorys: result.categorys
				}
				res.jsonp([200, data])
			} else {
				res.jsonp([200, {
					title: 'hioogo'
					, created_at: 0
					, updated_at: 0
					, status: ''
					, categorys: []
				}])
			}
		})
	},
	
	category: function(req, res) {
		res.jsonp([200, {}])
	},
	
	updateWebsite: function(req, res) {
		var post = req.body
		
		Setting.findOne().exec(function (err, result) {
			if (err) {
				res.jsonp([500, err])
				res.end()
			} else if (result){
				result.title = post['title']
				result.status = post['status']
			} else {
				result = new Setting({
					title: post['title'],
					status: parseInt(post['status'])
				})
			}
			
			result.save(function(err2){
				err2 ? res.jsonp([400, '更新失败'])
					: res.jsonp([200, '更新成功'])
			})
		})
	},
	
	updateCategory: function(req, res) {
		
	}
})
