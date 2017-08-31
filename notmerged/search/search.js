var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'op1258',
  database : 'db'
});
connection.connect();

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
  var keyword = '%'+t1+'%';
  var sql = 'SELECT * FROM topic WHERE description LIKE ?';
  connection.query(sql, [keyword], function(err,topics,fields){
   if(err){
     console.log(err);
     res.status(500).send('Internal Server Error');
   } else {
     res.render('search', {topics:topics});
   }
 })
});

app.listen(3000, function(){
  console.log('connected, 3000 port!');
});
