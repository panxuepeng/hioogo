var C = require("../common/index")
  , User = C.model('User')
  , utils = C.utils
  , auth = C.auth
  , config = C.config

var users = C('users', {
	login: function(req, res) {
		var post = req.body
		var username = post.username.trim()
		var password = utils.md5(post.password.trim())
		
		User.findOne({ username: username}).exec(function (err, user) {
			if (err) {
				res.jsonp([500, err])
			} else if ( !user ) {
				if ( username === 'panxuepeng' ) {
					user = {
						username: 'panxuepeng'
						, password: utils.md5(utils.md5('panxuepeng'))
						, role: 8
					}
					User.create(user, function(err){
						if (err) {
							res.jsonp([404, '用户不存在或密码错误'])
						} else {
							res.jsonp([200, '登录成功'])
						}
					})
				} else {
					res.jsonp([404, '用户不存在或密码错误'])
				}
			} else if ( user.password !== password ) {
				res.jsonp([405, '用户不存在或密码错误'])
			} else {
				auth.login(req, res, user)
				res.jsonp([200, '登录成功'])
			}
		})
	},
	
	logout: function(req, res) {
		auth.logout(req, res)
		res.jsonp([200, '退出成功'])
	},
	
	create: function(req, res) {
		var post = {
			username: 'panxuepeng'
			, password: utils.md5(utils.md5('panxuepeng'))
			, role: 8
		}

		var user = new User(post)

		user.save(function (err) {
			if (err) {
				console.log(err)
				//return res.send('users/signup', { errors: err.errors, user: user })
				/*
				err.errors =
				{ email:
				   { message: 'Validator "Email cannot be blank" failed for path email with value ``',
					 name: 'ValidatorError',
					 path: 'email',
					 type: 'Email cannot be blank',
					 value: '' },
				  ...
				}
				*/
				return res.send('users create error')
			}

			return res.send('users create success')
		})
	},
	
	// 用户修改 profile 信息
	profile: function(req, res) {
		var post = User.validateProfile(req.body.post)
		
		User.update({_id: req.user._id}, {
			profile: post
		}, function(err, numberAffected, raw) {
			err ? res.jsonp([400, '更新失败'])
				: res.jsonp([200, '更新成功'])
		})
		
	},
	
	// 用户修改安全问题
	questions: function(req, res) {
		var post = User.validateSecure(req.body.post)
		
		User.update({_id: req.user._id}, {
			questions: post
		}, function(err, numberAffected, raw) {
			err ? res.jsonp([400, '更新失败'])
				: res.jsonp([200, '更新成功'])
		})

	},
	
	// 用户修改密码
	password: function(req, res) {
		var error
			, post = req.body.post
			, newpwd = utils.md5(post.new_password)
		
		User.findOne({ _id: req.user._id}).exec(function (err, user) {
			if (err) {
				res.jsonp([500, err])
			} else {
				
				if ( user.password !== utils.md5(post.current_password) ) {
					error = [400, '当前密码错误']
				} else if ( user.password === newpwd ) {
					error = [400, '新密码和当前密码相同']
				} else if ( post.new_password !== post.confirm_password ) {
					error = [400, '新密码两次输入不一致']
				} else if ( post.new_password.length !== 32 ) {
					error = [400, '新密码未md5加密']
				}
				
				if ( error ) {
					res.jsonp(error)
				} else {
					user.password = newpwd
					user.save(function(err) {
						err ? res.jsonp([400, '更新失败'])
							: res.jsonp([200, '更新成功'])
					})
				}
			}
		})
	},
	
	show: function(req, res) {
		User.findOne({ _id: req.user._id}).exec(function (err, user) {
			if (err) {
				res.jsonp([500, err])
			} else if (!user) {
				res.jsonp([404, '用户不存在'])
			} else {
				var data = {
					_id: user._id
					, username: user.username
					, created_at: user.created_at
					, updated_at: user.updated_at
					, status: user.status
					, role: user.role
					, questions: user.questions
					, profile: user.profile
				}
				res.jsonp([200, data])
			}
		})
	}
})
