var express = require('express');
var router = express.Router();
var BoardContents = require('../../models/board-model.js');

router.get('/', function (req, res) {
    // 처음 index로 접속 했을시 나오는 부분
    // db에서 게시글 리스트 가져와서 출력
    BoardContents.find({}).sort({
        date: -1
    }).exec(function (err, rawContents) {
        // db에서 날짜 순으로 데이터들을 가져옴
        if (err) throw err;
        res.render('board', {
            title: "Board",
            contents: rawContents
        });
        // board.ejs의 title변수엔 “Board”를, contents변수엔 db 검색 결과 json 데이터를 저장해줌.
    });
});

module.export = router;
