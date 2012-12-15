
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , public = require('./routes/public')
  , admin = require('./routes/admin')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ uploadDir: path.join(__dirname, 'staging') }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Create a connection to the database
var db = mongoose.connect('mongodb://localhost/mosaicdev');

app.get('/', routes.index);
app.get('/upload', public.upload);
app.post('/upload', public.process);
app.get('/show', public.show);
app.get('/admin/upload', admin.upload);
app.post('/admin/confirm', admin.process);
app.post('/admin/finish', admin.confirm);
app.get('/admin/list', admin.list);
app.get('/admin/listtiles', admin.listtiles);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
