var Article = require("../../models/article");

//index page
exports.index = function(req, res){
  Article.fetch(function(err, articles){
    if(err){
      console.log(err);
    }
    Article
      .find({})
      .limit(3)
      .sort({"pv": -1})
      .exec(function(err, populars){
        res.render("pages/index", {
          title: "chrislion 孙驰的博客",
          articles: articles.slice(0,7),
          populars: populars
        });
      });
    
  });
}

//search page
exports.search = function(req, res){
  var key = req.query.key
  var page = parseInt(req.query.p, 10) || 0;
  var count = 5;
  var index = page * count;
  
  Article
    .find({"$or": [{title: new RegExp(key + '.*', 'i')}, {context: new RegExp(key + '.*', 'i')}]})
    .exec(function(err, articles) {
      if(err){
        console.log(err)
      }
      var results = articles.slice(index, index + count)
      console.log(results)

      res.render('pages/results', {
        title: '"' + key + '"的搜索结果 | chrislion 孙驰的博客',
        keyword: key,
        currentPage: (page + 1),
        query: 'key=' + key,
        totalPage: new Array(Math.ceil(articles.length / count)),
        articles: results
      });
  });
}