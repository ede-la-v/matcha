var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var users = require('./routes/controllers/users');
var tags = require('./routes/controllers/tags');
var likes = require('./routes/controllers/likes');
var auth = require('./routes/controllers/auth');
var notifs = require('./routes/controllers/notifs');
var messages = require('./routes/controllers/messages');
var me = require('./routes/controllers/me')
var geolocate = require('./routes/controllers/geolocation')

var router = express.Router();

var app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

router.use('/users', users);
router.use('/tags', tags);
router.use('/likes', likes);
router.use('/auth', auth)
router.use('/notifs', notifs);
router.use('/messages', messages);
router.use('/me', me)
router.use('/geolocate', geolocate)

app.use('/api', router);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
