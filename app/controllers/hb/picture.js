var Photo = require("../../models/photo");
var Album = require("../../models/album");
//list page
exports.index = function(req, res){
  res.render("pages/picture", {
    title: "图片浏览 | chrislion 孙驰的博客",
  });
}

exports.album = function(req, res){
  var id = req.params.id;
  Album
    .findOne({_id: id})
    .exec(function(err, album){
      res.render("pages/album", {
        title: "相册浏览 | chrislion 孙驰的博客",
        album: album,
        id: id
      });

  });
}

exports.getPhotos = function(req, res){
  var reqTime = req.query.n
  Photo
    .find({})
    .sort({"meta.updateAt": -1})
    .limit(15)
    .skip(reqTime*15)
    .exec(function(err, photos){
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
          result: photos
        });
      }
    });
}

exports.getAlbums = function(req, res){
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

exports.getPhotoByAlbum = function(req, res){
  var id = req.query.id;
  Album
    .findOne({_id: id})
    .populate({
      path: "photos",
      select: "name url"
    })
    .exec(function(err, album){
      res.json({
        status_code: 200,
        message: 'ok',
        result: album.photos
      });

  });
}