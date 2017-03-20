var Index = require("../app/controllers/hb/index");
var List = require("../app/controllers/hb/list");
var Detail = require("../app/controllers/hb/detail");
var Picture = require("../app/controllers/hb/picture");
var Admin = require("../app/controllers/admin/admin");
var Article = require("../app/controllers/admin/article");
var Upload = require("../app/controllers/admin/upload");
var PWA = require("../app/controllers/pwa");

module.exports = function(app){
  // pre handle user
  app.use(function(req, res, next){
    var _user = req.session.user;

    app.locals.user = _user;

    next();
  });

  // Homeblog
  app.get("/", Index.index);
  app.get("/list", List.list)
  app.get("/detail/:id", Detail.detail);
  app.get("/pictures", Picture.index);
  app.get("/albums/:id", Picture.album);

  //results
  app.get("/results", Index.search);

  // Admin
  app.post("/user/signup", Admin.signup);
  app.post("/user/login", Admin.login);
  app.get("/login", Admin.showLogin);
  app.get("/signup", Admin.showSignup);

  // API
  app.get("/hb/photos", Picture.getPhotos);
  app.get("/hb/albums", Picture.getAlbums);
  app.get("/hb/photobyalbum", Picture.getPhotoByAlbum);

  // app.get("/admin/", Admin.signinRequired, Admin.adminRequired, Admin.index);
  // app.get("/admin/articleManagement", Admin.signinRequired, Admin.adminRequired, Article.articleManagement);
  // app.get("/admin/uploadManagement", Admin.signinRequired, Admin.adminRequired, Upload.uploadManagement);
  // app.post("/admin/article", Admin.signinRequired, Admin.adminRequired, Article.articleSave);
  // app.get("/logout", User.logout);
  // app.get("/admin/user/list", User.signinRequired, User.adminRequired, User.list);

  // Admin v2.0
  app.get("/admin/*",  Admin.signinRequired, Admin.adminRequired, Admin.all);

  // API
  app.get("/articles", Admin.getArticleAll);
  app.post("/articles", Admin.addArticle);
  app.get("/articles/:id", Admin.getArticleDetail);
  app.put("/articles/:id", Admin.updateArticle);
  app.delete("/articles/:id", Admin.deleteArticle);

  app.get("/album", Admin.getAlbumAll);
  app.post("/album", Admin.addAlbum);
  app.get("/album/:id", Admin.getAlbumDetail);
  app.put("/album/:id", Admin.updateAlbum);
  app.delete("/album/:id", Admin.deleteAlbum);

  app.get("/photo", Admin.getPhotoAll);
  app.post("/photo", Admin.addPhoto);
  app.delete("/photo/:id", Admin.deletePhoto);

  app.post("/upload", Admin.uploadImg);

  // PWA API
  app.get('/pwa/beauty/directories', PWA.getBeautyDirectoryAll);
  app.get('/pwa/beauty/directory/:id', PWA.getBeautyDirectoryDetail);

}