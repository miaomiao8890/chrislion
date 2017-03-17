var User = require("../../models/user");
var Article = require("../../models/article");
var Album = require("../../models/album");
var Photo = require("../../models/photo");
var _ = require("underscore");
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');
var qiniuUpload = require('../../lib/upload');

//注册
exports.showSignup = function(req, res){ 
  res.render("admin/signup", {
    title: "注册"
  });
}

exports.signup = function(req, res){
  var _user = req.body.user;
  //console.log(user);

  User.findOne({name: _user.name}, function(err, user){
    if(err){
      console.log(err);
    }
    if(user){
      return res.redirect("/login");
    }else{
      user = new User(_user);
      user.save(function(err, user){
        if(err){
          console.log(err);
        }
        res.redirect("/")
      });
    }
  });
}
//登陆
exports.showLogin = function(req, res){
  res.render("admin/login_v2", {
    title: "登陆 | Chrislion 孙驰的个人博客"
  });
}

exports.login = function(req, res){
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function(err, user){
    if(err){
      console.log(err);
    }

    if(!user){
      return res.redirect("/signup");
    }

    user.comparePassword(password, function(err, isMatch){
      if(err){
        console.log(err);
      }

      if(isMatch){
        req.session.user = user;

        return res.redirect("/admin/");
      }else{
        return res.redirect("/login");
        console.log("Password is not matched");
      }
    });
  });
}

//admin 首页
exports.index = function(req, res){
  res.render("admin/index", {
    title: "系统后台-首页"
  });
}

//midware for user
exports.signinRequired = function(req, res, next){
  var user = req.session.user;
  if(!user){
    return res.redirect("/login");
  }

  next();
}

exports.adminRequired = function(req, res, next){
  var user = req.session.user;

  if(user.role <= 10){
    return res.redirect("/login");
  }

  next();
}

// Admin v2.0
exports.all = function(req, res){
  res.render("admin/index_v2", {
    title: "系统后台 | Chrislion 孙驰的个人博客"
  });
}

// API
exports.getArticleAll = function(req, res) {
  Article.fetch(function(err, articles){
    if(err){
      res.json({
        status_code: 500,
        message: err,
        result: []
      });
    } else {
      res.json({
        status_code: 200,
        message: 'ok',
        result: articles
      });
    }
  });
}

exports.getArticleDetail = function(req, res){
  var id = req.params.id;

  Article.findById(id, function(err, article){
    if(err){
      res.json({
        status_code: 500,
        message: err,
        result: {}
      });
    } else {
      res.json({
        status_code: 200,
        message: 'ok',
        result: article
      });
    }
  });
}

exports.addArticle = function(req, res){
  var articleObj = req.body;
  if(req.body.title == '') {
    res.json({
      status_code: 400,
      message: 'The title is required'
      // result: article
    });
  } else {
    var _article;

    _article = new Article(articleObj);

    _article.save(function(err, article){
      if(err){
        console.log(err);
      }
      res.json({
        status_code: 200,
        message: 'ok',
        result: article
      });
    });
  }
}

exports.deleteArticle = function(req, res){
  var id = req.params.id;
  if(id){
    Article.remove({_id: id},function(err, article){
      if(err){
        res.json({
          status_code: 500,
          message: err,
          result: {}
        });
      }else{
        res.json({
          status_code: 200,
          message: 'ok',
          result: article
        });
      }

    })
  }
}

exports.updateArticle = function(req, res){
  var articleObj = req.body;
  var id = articleObj._id;
  var _article;

  Article.findById(id, function(err, article){
    if(err){
      console.log(err)
    }

    _article = _.extend(article, articleObj);
    _article.save(function(err, article){
      if(err){
        res.json({
          status_code: 500,
          message: err,
          result: {}
        });
      }else{
        res.json({
          status_code: 200,
          message: 'ok',
          result: article
        });
      }

    });
  });
}

// album

exports.getAlbumAll = function(req, res) {
  Album.fetch(function(err, albums){
    if(err){
      res.json({
        status_code: 500,
        message: err,
        result: []
      });
    } else {
      res.json({
        status_code: 200,
        message: 'ok',
        result: albums
      });
    }
  });
}

exports.addAlbum = function(req, res){
  var albumObj = req.body;
  if(req.body.name == '') {
    res.json({
      status_code: 400,
      message: 'The name is required'
    });
  } else {
    var _album;

    _album = new Album(albumObj);

    _album.save(function(err, album){
      if(err){
        console.log(err);
      }
      res.json({
        status_code: 200,
        message: 'ok',
        result: album
      });
    });
  }
}

exports.getAlbumDetail = function(req, res){
  var id = req.params.id;

  Album.findById(id, function(err, album){
    if(err){
      res.json({
        status_code: 500,
        message: err,
        result: {}
      });
    } else {
      res.json({
        status_code: 200,
        message: 'ok',
        result: album
      });
    }
  });
}

exports.deleteAlbum = function(req, res){
  var id = req.params.id;
  if(id){
    Album.remove({_id: id},function(err, album){
      if(err){
        res.json({
          status_code: 500,
          message: err,
          result: {}
        });
      }else{
        res.json({
          status_code: 200,
          message: 'ok',
          result: album
        });
      }

    })
  }
}

exports.updateAlbum = function(req, res){
  var albumObj = req.body;
  var id = albumObj._id;
  var _album;

  Album.findById(id, function(err, album){
    if(err){
      console.log(err)
    }

    _album = _.extend(album, albumObj);
    _album.save(function(err, album){
      if(err){
        res.json({
          status_code: 500,
          message: err,
          result: {}
        });
      }else{
        res.json({
          status_code: 200,
          message: 'ok',
          result: album
        });
      }

    });
  });
}

/* photo */
exports.getPhotoAll = function(req, res) {
  var id = req.query.albumid;
  Album
    .findOne({_id: id})
    .populate({
      path: "photos",
      select: "name url"
    })
    .exec(function(err, album){
      if(err){
        res.json({
          status_code: 500,
          message: err,
          result: []
        });
      }
      res.json({
        status_code: 200,
        message: 'ok',
        result: album
      });

  });
}

exports.addPhoto = function(req, res){
  var photoObj = req.body;
  if(req.body.url == '') {
    res.json({
      status_code: 400,
      message: 'The url is required'
    });
  } else {
    var _photo;

    _photo = new Photo(photoObj);

    _photo.save(function(err, photo){
      if(err){
        console.log(err);
      }
      var albumId = photoObj.albumId;

      Album.findById(albumId, function(err, album){

        album.photos.push(photo._id);

        album.save(function(err, album){
          res.json({
            status_code: 200,
            message: 'ok',
            result: album
          });
        })
      });
    });
  }
}

exports.deletePhoto = function(req, res){
  var id = req.params.id
    , albumid = req.query.albumid;
  if(id){
    Photo.remove({_id: id},function(err, photo){
      if(err){
        res.json({
          status_code: 500,
          message: err,
          result: {}
        });
      }else{
        // res.json({
        //   status_code: 200,
        //   message: 'ok',
        //   result: photo
        // });
        Album.findById(albumid, function(err, album){

          var newPhotos = album.photos.filter(function(photo) {
            return photo != id
          });
          console.log(newPhotos);

          album.photos = newPhotos;

          album.save(function(err, album){
            res.json({
              status_code: 200,
              message: 'ok',
              result: album
            });
          })
        });
      }

    })
  }
}

exports.uploadImg = function(req, res) {
  
  var form = new multiparty.Form({
  });

  form.on('error', function(err) {
    console.log('Error parsing form: ' + err.stack);
  });

  form.parse(req, function(err, fields, files) {
    var file = files.fileUploaded[0];
    // 上传七牛
    qiniuUpload(file, function(result) {
      console.log(result);
      res.writeHead(200,{"Content-Type":"text/html"});
      res.end("<img id='imgUrl' src='http://ogexl3o64.bkt.clouddn.com/"+ result.key +"' data-original='"+ file.originalFilename +"' style='width: 320px; height: 180px;' />");
      fs.unlink(file.path, function() {
        console.log('临时文件已删除 filepath:' + file.path)
      })
    })
    
  });
}

