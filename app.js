const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// public 폴더 안의 스크립트 파일 임포트 적용
app.use(express.static('public'));
// request.body에 객체 형식의 데이터 포맷을 넘겨주는 함수
app.use(bodyParser.json());
// 모름
app.use(bodyParser.urlencoded({extended: false}));

// localhost의 루트 페이지를 메인 페이지로 이동 시키도록 설정
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/main.html');
});

// 서버 실행
app.listen(3000, () => {
	console.log('node start!');
});
