
var auth = require('../common/auth')

module.exports = function (app, C) {
	
	var u = C('users')
	app.get('/user', auth.userRequired, u.show)
	app.post('/login', u.login)
	app.get('/logout', u.logout)
	app.get('/signup', u.create)
	
	app.put('/center/profile', u.profile)
	app.put('/center/password', u.password)
	app.put('/center/questions', u.questions)
	
	
	
	var topics = C('topics')
	app.get('/topics', topics.index)
	app.get('/topics/:topicid', topics.show)
	app.post('/topics', topics.create)
	
	// 更新操作需验证作者身份
	app.put('/topics/:topicid', topics.auth, topics.update)
	app.put('/topics/recommend/:topicid', auth.adminRequired, topics.recommend)
	app.del('/topics/:topicid', topics.auth, topics.del)
	
	
	var photos = C('photos')
	app.get('/photos', photos.index)
	app.post('/photos', photos.upload)
	app.put('/photos/:photoid', photos.auth, photos.update)
	app.del('/photos/:photoid', photos.auth, photos.del)
	
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