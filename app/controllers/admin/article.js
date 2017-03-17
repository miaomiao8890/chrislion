var Article = require("../../models/article");
var _ = require("underscore");

//admin 文章管理
exports.articleManagement = function(req, res){
  Article.fetch(function(err, articles){
    if(err){
      console.log(err);
    }
    res.render("admin/articleManagement", {
      title: "系统后台-文章管理",
      articles: articles
    });
  });
}

//admin post article
exports.articleSave = function(req, res){
  var id = req.body._id;
  var articleObj = req.body;
  var _article;
  if(id && id != ""){
    Article.findById(id, function(err, article){
      if(err){
        console.log(err)
      }

      _article = _.extend(article, articleObj);
      _article.save(function(err, article){
        if(err){
          console.log(err);
        }
        // res.json({message: "success", data:{}}});
        res.redirect("/admin/articleManagement");
      });
    });
  }else{
    delete articleObj._id;
    _article = new Article(articleObj);

    _article.save(function(err, article){
      if(err){
        console.log(err);
      }

      // res.json({message: "success", data:{}}});
      res.redirect("/admin/articleManagement");
    });
  }
}