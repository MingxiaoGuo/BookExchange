var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var passwordHash = require('password-hash');
var session = require('express-session');
var mongoose = require('mongoose');
var multer = require('multer');

// request controller
var index = require('./routes/index');
var bookDetail = require('./routes/bookDetail');
var register = require('./routes/register');
var login = require('./routes/login');
var profile = require('./routes/profile');
var uploadCover = require('./routes/uploadCover');
var bookList = require('./routes/bookList');
var bookInfo = require('./routes/bookInfo');

var app = express();
// set up mongodb
mongoose.connect('localhost:27017/book_exchange');
// get rid of warning: Mongoose: mpromise (mongoose's default promise library) is deprecated...
mongoose.Promise = global.Promise;

// view engine setup
app.set('views', __dirname + '/views');
console.log(__dirname)
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// for session access
app.use(cookieParser());
app.use(session({
  secret : 'Miaoyu_Li',
  cookie : {/*secure : true*/}
}));

// controllers
app.use('/bookInfo', bookInfo);
app.use('/bookList', bookList);
app.use('/bookDetail', bookDetail);
app.use('/register', register);
app.use('/login', login);
app.use('/profile', profile);
app.use('/uploadCover', uploadCover);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
