  var fs = require('fs')
  , gm = require('gm')
  , config = process.appConfig
  
  
// 记录exif信息到文件
// 每种相机型号记录一个文件
exports.exif = function(req, res, next) {
	gm(req.files.photo.path)
	.identify(function(err, data){
		if (err) {
			res.jsonp({error:1, msg: err})
		} else if (data && data['Profile-EXIF']) {
			var exif = data['Profile-EXIF']
			delete exif['Maker Note']
			delete exif['0xC4A5']
			delete exif['User Comment']
			
			var path = config.root + "/exif/"+exif['Model']+".txt"
			if ( shell.test('-f', path) ) {
				fs.writeFile(path, JSON.stringify(data), function(err) {
					if (err) {
						res.jsonp({error:1, msg: err})
					} else {
						next()
					}
				})
			} else {
				next()
			}
		} else {
			next()
		}
	})
}