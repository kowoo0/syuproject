const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mg_config = require('./config/mg-config.json');
const router = require('./routes/index');
const FB = require('fb');
const fb_config = require('./config/fb-config.json');

// public 폴더 안의 스크립트 파일 임포트 적용
app.use(express.static('public'));
// request.body에 객체 형식의 데이터 포맷을 넘겨주는 함수
app.use(bodyParser.json());
// 모름
app.use(bodyParser.urlencoded({extended: false}));

const conn = mongoose.connection;
mongoose.Promise = global.Promise;

conn.on('error', console.error.bind(console, "mongoose connection error:"));
conn.openUri(`mongodb://${mg_config.userId}:${mg_config.userPass}@${mg_config.userLocal}/${mg_config.db}`);
conn.once('open', () => {
	console.log("mongoose connect successfully..");
});

function getAccessToken() {
	FB.api('oauth/access_token', {
		client_id: fb_config.clientId,
		client_secret: fb_config.clientSecret,
		grant_type: fb_config.grantType
	}, function(res) {
		if(!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		} else {
			const accessToken = res.access_token;
			FB.setAccessToken(accessToken);
			console.log('get access token successfully');
		}
	});
}
getAccessToken();

// 서버 실행
server.listen(3000, () => {
	console.log('node start!');
});
// use ejs template
app.set('view engine', 'ejs');
app.use(router);
