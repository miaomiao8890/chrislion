var Article = require("../../models/article");
//list page
exports.list = function(req, res){
  Article.fetch(function(err, articles){
    if(err){
      console.log(err);
    }
    Article
      .find({})
      .limit(3)
      .sort({"pv": -1})
      .exec(function(err, populars){
        res.render("pages/list", {
          title: "文章列表 | chrislion 孙驰的博客",
          articles: articles,
          populars: populars
        });
      });
    
  });
}