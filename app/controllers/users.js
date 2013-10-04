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
		
		User.findOne({ username: username}).exec(function (err, result) {
			if (err) {
				res.jsonp([500, err])
			} else if ( !result ) {
				res.jsonp([404, '用户不存在或密码错误'])
			} else if ( result.password !== password ) {
				res.jsonp([405, '用户不存在或密码错误'])
			} else {
				auth.login(req, res, result)
				res.jsonp([200, '登录成功'])
			}
		});
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
		};

		var user = new User(post);

		user.save(function (err) {
			if (err) {
				console.log(err);
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
	
	show: function(req, res) {
		var user = auth.get(req)
		var data = {
			_id: user._id
			, username: user.username
			, updated_at: user.updated_at
			, role: user.role
		}
		user ? res.jsonp([200, data])
			: res.jsonp([404, '用户不存在'])
	}
});

