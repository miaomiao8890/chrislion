var express = require("express");
// var partials = require('express-partials');
var path = require("path");
var mongoose = require("mongoose");
var swig = require('swig');

var port = process.env.PORT || 8080;
var app = express();
var options = {
  user: 'admin',
  pass: '=7wx&rJKw8J%ZIJ^iBV234)Tz5s78huhoIHsHD8786*)hs'
}
var dbUrl = "mongodb://superuser:j8asfjj9$80(as**hh))80asf@127.0.0.1:27017/homeblog";
mongoose.connect(dbUrl);
//favicon
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));

app.set("views", "./app/views/");
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
// app.use(partials());

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());

var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
app.use(session({
  secret: "homeblog",
  store: new mongoStore({
    url: dbUrl,
    collection: "sessions"
  })
}));

var cookieParser = require('cookie-parser');
app.use(cookieParser())

//app.use(express.multipart());
//var multer  = require('multer');
//app.use(multer());

app.use(express.static(path.join(__dirname, "public")));
app.locals.moment = require("moment");
app.listen(port);

console.log("homeblog started on prot " + port);

var morgan = require("morgan");
if("development" === app.get("env")) {
  app.set("showStackError", true);
  app.use(morgan(":method :url :status"));
  app.locals.pretty = true;
  mongoose.set("debug", true);
} 

require("./config/routes")(app);
