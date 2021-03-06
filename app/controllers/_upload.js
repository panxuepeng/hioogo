var C = require("../common/index")
  , shell = require('shelljs')
  , fs = require('fs')
  , gm = require('gm')
  , User = C.model('User')
  , Photo = C.model('Photo')
  , utils = C.utils
  , auth = C.auth
  , async = C.async
  , _ = C._
  , config = process.appConfig
  
function series(req, res) {
	return {
		// 判断图片是否已存在
		// 不存在时进入下一步，直接返回图片路径
		check: function(cb) {
			
			if (!req.files.photo) {
				cb('未检测到上传图片')
			} else {
				var photo = req.files.photo
				var size = photo.size || photo.length
				var contentType = ''
				
				if (photo.headers) {
					contentType = photo.headers['content-type']
				} else if (photo.type) {
					contentType = photo.type
				} else {
					console.log('没有发现上传文件类型')
				}
				
				if (size > config.postLimit) {
					cb('只能上传10M内的图片文件')
				}
				if (contentType.substr(0, 5) !== 'image') {
					cb('只能上传图片文件')
				}
			}
			
			cb(null, true)
		},
		
		isExist: function(cb) {
			var path = req.files.photo.path;
			fs.readFile(path, function (err, data) {
				var photoMd5 = utils.md5(data);
				req.photoMd5 = photoMd5;
				req.photoData = data;
				
				Photo
				.findOne({ mark: photoMd5})
				.exec(function (err, photo) {
					if (err) {
						cb(err);
					} else if ( _.isEmpty(photo) ) {
						// 图片不存在，继续
						cb(null, true);
					} else {
						// 图片以及存在，直接返回
						res.jsonp({id:photo._id, url:Photo.getPhotoUrl(photo)});
					}
				})
			})
		},
		
		// 获取照片的元信息
		// 如果是不带exif信息图片，则使用默认值（空）
		getExif: function(cb) {
			gm(req.photoData)
			.identify(function(err, data){
				var exif
				
				if (data && data['Profile-EXIF']) {
					exif = data['Profile-EXIF']
					// console.log(data)
					// 删除一些没用，但是比较长的字段信息
					delete exif['Maker Note']
					delete exif['0xC4A5']
					delete exif['User Comment']
					
					exif.width = data['size'].width
					exif.height = data['size'].height
					exif.filename = data.path
					
					var dt = exif['Date Time'] || exif['Date Time Original']
					dt = dt.split(' ')
					dt[0] = dt[0].replace(':', '/').replace(':', '/')
					exif['Date Time'] = new Date(dt.join(' '))
				} else {
					exif = {
						'Date Time': null
						, 'width': 0
						, 'height': 0
						, 'Make': ''
						, 'Model': ''
						, 'ISO Speed Ratings': ''
						, 'Exposure Time': ''
						, 'Focal Length': ''
						, 'F Number': ''
						, 'Exposure Program': ''
					}
				}
				req.photoExif = exif
				
				if (err) {
					cb(err);
				} else{
					cb(null, true);
				}
			})
		},
		
		// 保存原始图片和缩略图
		write: function(cb) {
			var savePath = getSavePath(req.photoMd5);
			var photoData = req.photoData;
			// 创建缩略图
			fs.writeFile(savePath, photoData, function(err) {
				if (err) {
					cb(err)
				} else {
					var thumbPath
					async.eachLimit(config.thumbList, 2, function(item, cb2) {
						thumbPath = savePath.replace('photo', 'public/photo/'+item[0])
						
						gm(photoData)
						.noProfile()
						.resize(item[0], item[1])
						.write(thumbPath, function (err2) {
							cb2(err2)
						});
					}, function(err3) {
						var url = thumbPath.split('public')[1]
						url = url.replace(/photo\/\d{3,4}/, 'photo/'+config.thumbList[0][0])
						cb(err3, url)
					});
				}
			})
		},
		
		// 保存到数据库
		insert: function(cb) {
			
			var photo = Photo.create({
				exif: req.photoExif
				, user_id: req.user._id
				, photoData: req.photoData
				, photoMd5: req.photoMd5
				, created_at: req.time
				, updated_at: req.time
				, status: 1
			})
			delete req.photoExif
			delete req.photoData
			photo.save(function(err, result) {
				if (err) {
					cb(err)
				} else {
					cb(null, result._id)
				}
			});
			
		}
	}
}

// 返回图片保存地址
function getSavePath(mark) {
	var d = new Date
	year = d.getFullYear()
	month = d.getMonth()+1
	day = d.getDate()
	month = (month > 9) ? month: '0'+month
	day = (day > 9) ? day: '0'+day
	
	var path = config.root + "/photo/"+year+""+month+"/"+day
	if (!shell.test('-d', path)) {
		shell.mkdir('-p', path);
		_.each(config.thumbList, function(item){
			shell.mkdir('-p', path.replace('photo', 'public/photo/'+item[0]));
		})
	}
	return path+"/"+mark+".jpg"
}

module.exports = series