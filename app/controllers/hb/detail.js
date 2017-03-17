var Article = require("../../models/article");

//detail page
exports.detail = function(req, res){
  var id = req.params.id;

  Article.update({_id: id}, {$inc: {pv: 1}}, function(err) {
    if(err){
      console.log(err);
    }
  })

  Article.findById(id, function(err, article){
    Article
      .find({})
      .limit(3)
      .sort({"pv": -1})
      .exec(function(err, populars){
        res.render("pages/detail", {
          title: "chrislion " + article.title,
          article: article,
          populars: populars
        });
      });
  });
}