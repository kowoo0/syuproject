const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const mg_config = require('./config/mg-config.json');

const router = require('./routes/index');

const port = process.env.PORT || 3000;

const conn = mongoose.connection;
mongoose.Promise = global.Promise;

// 정적 파일 요청을 위한 public 폴더 지정
app.use(express.static('public'));
// Request Body 내용을 가져오기 위한 미들웨어
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use ejs, jade template
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.set('view engine', 'jade');

app.use(router);

conn.on('error', console.error.bind(console, 'mongoose connection error:'));
conn.openUri(`mongodb://${mg_config.userId}:${mg_config.userPass}@${mg_config.userLocal}/${mg_config.db}`);
conn.once('open', () => {
	console.log('mongoose connect successfully...');
});

// 서버 실행
app.listen(port, () => {
	console.log('Server listening port at ' + port);
});

