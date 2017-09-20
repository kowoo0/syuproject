var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sample');
var db = mongoose.connection;
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
  var t1 = req.body.t1;
  var keyword = '/'+t1+'/';
  var search = {name : keyword};
  db.collection("test").find(keyword).toArray(function(err,topics){
  if (err) throw err;
  res.render('search', {topics:topics});
});
});
