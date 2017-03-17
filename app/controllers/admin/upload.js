var fs = require("fs");
var path = require("path");

//admin 图片上传管理
exports.uploadManagement = function(req, res){
  fs.readdir('././public/upload/', function(err, list) {
    if (err) {
      return console.log(err);
    }
    // console.log(list);
    res.render("admin/uploadManagement", {
      title: "系统后台-图片上传管理",
      srcs: list
    });
  });
}