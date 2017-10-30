var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var Allfeeds = require('../../models/all-model');
var mongoose = require('mongoose');
var db = mongoose.connection;
db.openUri('mongodb://kkodu:nawy8476*-@localhost/admin');
db.on('error', console.error.bind(console,'connection error'));
db.once('open', function callback(){
  console.log("mongo db connection OK.");
});

app.listen(3000, function(){
  console.log('connected, 3000 port!');
});

var bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.locals.pretty = true;

app.set('views', 'views');
app.set('view engine', 'jade');

app.get('/search', function(req,res){
  res.render('form');
});

app.post('/search/result', function(req,res){
  var keyword = req.body.t1;
  var search = { message : {$regex : keyword}};
  Allfeeds.find(search).sort({ created_time: -1 }).exec(function(err,topics){
  if (err) throw err;
  res.render('search', {topics:topics});
  });
});
