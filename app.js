const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const dotenv = require('dotenv');
const {generateMessage, generateLocationMessage} = require('./app/utils/message');
const {isValidString} = require('./app/utils/validation');


// set env from .env.test for test mode.
require('./app/config');

var webRoutes = require('./routes/web');
var ApiRoutes = require('./routes/api');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');
hbs.localsAsTemplateData(app);
app.locals.var1 = "Gloabal Variable";

hbs.registerHelper('newMessage', function(context, options) {
  return options.fn(context);
});


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', webRoutes);
app.use('/api/', ApiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // var err = new Error('Not Found');
  // err.status = 404;
  res.status(404).sendFile(path.join(__dirname+'/public/404.html'));
  // next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('join', (params, callback) => {

    if (!isValidString(params.name) && !isValidString(params.room)) {
      callback('Name and Room name are reqiured.');
    }

    callback();

  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);

});

module.exports = app;
