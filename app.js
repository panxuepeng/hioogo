var express = require('express')
  , Controller = require("./app/common/controller")
  , env = process.env.NODE_ENV || 'development'
  , confPath = './app/config'
  , config = require(confPath+'/config')[env]
  , fs = require('fs')
  , mongoose = require('mongoose')
  
process.appConfig = config;

function load(dirname) {
	var models_path = __dirname + '/app/'+dirname
	fs.readdirSync(models_path).forEach(function (file) {
		require(models_path+'/'+file)
	})
}

// ��controller ���õ� model�ļ���models ��Ҫ��ǰ�� controllers ����
load('models')
load('controllers')

var app = express()
require(confPath+'/express')(app, config)
require(confPath+'/routes')(app, Controller)

// Bootstrap db connection
mongoose.connect(config.db)

app.listen(config.port)
console.log('hioogo started on port '+config.port)

// expose app
exports = module.exports = app