var express = require('express');
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var session = require('express-session');


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'js3448',
  database : 'o2'
});
connection.connect();
var app = express();
app.get('/form', function(req,res){
  res.render('form');
});
app.use(express.static('test'));
app.use(bodyparser.urlencoded({ extended: false}));
app.get('/login', function(req, res){ // 예쁜 로그인 저장용 html css
  var output2 = `
  <html>
  </head>
  <title>3-21.html</title>
  </head>
  <body leftmargin="0" topmargin = "0" marginwith = "0" marginheight = "0">
  <center>
  <table width = "600" cellpadding = "5"cellspacing = "1" bgcolor = "#CCCCCC">
  <tr>
  <td colspan = "2"><font color = "#FFFFFF"><B>로그인</b></font></td>
  </tr>
  <!--아이디-->
  <tr>
  <td align = "right" bgcolor = "#F4F4F4"><font color = "#FF9900"></font>아이디&nbsp;</td>
  <td bfcolor = "#FFFFFF">
  <input type = "text" maxlength = "12" name = "userid">
  <font color = "#FF9900" size = "2">(4~12자 영문자/숫자 가능)</font>
  </td>
  </tr>
  <!--비밀번호-->
  <tr>
  <td align = "right" bgcolor = "#F4F4F4"><font color = "#FF9900"></font>비밀번호&nbsp;</td>
  <td bfcolor = "#FFFFFF">
  <input type = "text" maxlength = "8" name = "userpw">
  <font color = "#FF9900" size = "2">(4~8자 이내로 만들어주세요)</font>
  </td>
  </tr>
  <tr bgcolor = "#FFFFFF">
  <td height = "30" colspan = 2 align = "center">
  <input type = "submit" name = "regist" value = "로그인">
  </td>
  </tr>


  </table>
  </center>
  </body>
  </html>
  `;
  res.send(output2);
});

app.get('/html2', function(req, res){
  res.sendFile(__dirname + "/html2.html");
  console.log(req.query.userid); // 쿼리 정보 가공
});
app.use(session({       // 세션 사용
  secret : 'secret', // 세션 키
  resave : false,
  saveUninitialized : true
}));
app.use(cookieparser()); // 쿠키값 사용
app.get('/html2_login', function(req,res){
  var userid = req.query.userid;
  var userpw = req.query.userpw;
  res.cookie('userid',userid);
  res.cookie('userpw',userpw);
  res.send (userid + userpw);

});
app.post('/html2_login', function(req,res){
  var user = {    //DB에서 처리해야할 인증 절차
    username : 'bqwer12',
    password : '111',
    displayname : 'Bqwer12' // DB에서 처리해야할 세션 인증 아이디
    };
  var userid = req.body.userid;
  var userpw = req.body.userpw;
  if(userid === user.username && userpw === user.password){
    req.session.displayName = user.displayname;
  }// 세션 할당
if(req.session.displayName){


    res.send("Hello admin");
  }
  else {
    res.send("Who r u?");
  }



  res.send (req.body.username);
});

app.get('/count', function(req, res){
 res.cookie('count',1);
 res.send('cout : ');

});

app.get('/query', function(req, res){
  res.send(req.query.id);
});

app.listen(3000, function(){
  console.log('connected 3000 port!');
});
