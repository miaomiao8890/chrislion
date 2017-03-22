var express = require("express");
// var partials = require('express-partials');
var path = require("path");
var mongoose = require("mongoose");
var swig = require('swig');

var port = process.env.PORT || 8080;
var sslport = process.env.PORT || 443
var app = express();

// https
var fs = require('fs')
var http = require('http')
var https = require('https')
var hskey  = fs.readFileSync('/usr/local/ssl/hacksparrow-key.pem')
var hscert = fs.readFileSync('/usr/local/ssl/hacksparrow-cert.pem')
var credentials = {key: hskey, cert: hscert}
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app)

var dbUrl = "mongodb://superuser:j8asfjj9$80(as**hh))80asf@123.57.21.57:27017/homeblog";
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
// app.listen(port);

httpServer.listen(port, function() {
  console.log('HTTP Server is running on: http://localhost:%s', port);
});
httpsServer.listen(sslport, function() {
  console.log('HTTPS Server is running on: https://localhost:%s', sslport);
});

var morgan = require("morgan");
if("development" === app.get("env")) {
  app.set("showStackError", true);
  app.use(morgan(":method :url :status"));
  app.locals.pretty = true;
  mongoose.set("debug", true);
}

require("./config/routes")(app);
