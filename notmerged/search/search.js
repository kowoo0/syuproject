var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/sample', {useMongoClient : true});
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
  var text = req.body.t1;
  var keyword = "/"+text+"/";
  var search = {name : keyword};
  db.collection("test").find(search).toArray(function(err,topics){
  if (err) throw err;
  res.render('search', {topics:topics});
});
});
