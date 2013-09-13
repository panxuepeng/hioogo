
var auth = require('../common/auth')
  , userRequired = auth.userRequired // 登录验证过滤器

module.exports = function (app, C) {
	
	var u = C('users')
	app.get('/user', u.show)
	app.post('/login', u.login)
	app.get('/logout', u.logout)
	app.get('/signup', u.create)
	
	
	var topics = C('topics')
	app.get('/topics', topics.index)
	app.get('/topics/:topicid', topics.show)
	app.post('/topics', userRequired, topics.create)
	//更新操作需验证作者身份
	app.put('/topics/:topicid', topics.auth, topics.update)
	app.del('/topics/:topicid', topics.auth, topics.destroy)
	
	
	var photos = C('photos')
	app.get('/photos', photos.index)
	app.post('/photos', photos.upload)
	app.put('/photos/:photoid', photos.auth, photos.update)
	app.del('/photos/:photoid', photos.auth, photos.destroy)
	
}

/*
GET	/resource	index	resource.index
GET	/resource/create	create	resource.create
POST	/resource	store	resource.store
GET	/resource/{id}	show	resource.show
GET	/resource/{id}/edit	edit	resource.edit
PUT/PATCH	/resource/{id}	update	resource.update
DELETE	/resource/{id}	destroy	resource.destroy
*/