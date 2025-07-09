var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cadastroRouter = require('./routes/cadastro');
var loginAdminRouter = require('./routes/loginAdmin');
var explorarRouter = require('./routes/explorar');
var profileRouter = require('./routes/profile');
var videoRouter = require('./routes/video');
var countryRouter = require('./routes/country');
var createPostRouter = require('./routes/createPost');
var createVideoRouter = require('./routes/createVideo');
var roteiroRouter = require('./routes/roteiro');
var manageRouter = require('./routes/manage');

var app = express();
global.banco = require('./db');

app.use(session({
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user_id = req.session.user_id || null;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cadastro', cadastroRouter);
app.use('/loginAdmin', loginAdminRouter);
app.use('/explorar', explorarRouter);
app.use('/profile', profileRouter);
app.use('/assistir', videoRouter);
app.use('/country', countryRouter);
app.use('/createPost', createPostRouter);
app.use('/createRoteiro', createVideoRouter);
app.use('/roteiro', roteiroRouter);
app.use('/manage', manageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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