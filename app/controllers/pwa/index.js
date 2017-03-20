var BeautyDirectory = require("../../models/pwa/beauty_directory");
var BeautyPhoto = require("../../models/pwa/beauty_photo");

// API
exports.getBeautyDirectoryAll = function(req, res) {
  BeautyDirectory.fetch(function(err, beautyDirectories){
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
        result: beautyDirectories
      });
    }
  });
}

exports.getBeautyDirectoryDetail = function(req, res){
  var id = req.params.id;

  BeautyDirectory
    .findOne({_id: id})
    .populate({
      path: "beauty_photos",
      select: "url"
    })
    .exec(function(err, beautyDirectory){
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
          result: beautyDirectory
        });
      }
  });
}