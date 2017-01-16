var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var winston = require('winston');
var nunjucks = require('nunjucks');
var ig = require('instagram-node').instagram();


ig.use({"client_id":"98d00d95db5540ed986ce0eb2f9e0c46",
"client_secret":"71bf749dd61947ada2e77f556c463d30"});

//ig.media_popular(function(err, media, limit){
//  if (err){ throw err; }
//  console.log(media);
//})

//  routes
var index = require('./routes/index');
var users = require('./routes/users');
var popular = require('./routes/popular');

var app = express();

nunjucks.configure('views', {
  autoescape:true,
  express:app
});

nconf.file("config.json");

nconf.defaults({
  "http":{
    "port":4000
  }
});

winston.info("Initialised nconf");
winston.info('HTTP Configuration', nconf.get("http"));

winston.add(winston.transports.File,{"filename":"error.log", "level":nconf.get("logger:fileLevel")});
winston.error("Something went wrong");



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/popular', popular);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
