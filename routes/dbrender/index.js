const express = require('express');
const router = express.Router();
const ALLFeeds = require('../../models/fb/post.js');

// 맞는지 모르겠지만... 스태틱 변수 생성.. 크롤링해오는 데이터 중 최신 피드의 생성 시간을 저장한다.
let mostRecentlyData = (function() {
  let staticVar = 0;
  return staticVar;
})();

let fixedPrimaryDate; // 초기 데이터 시간 고정값

// 무한 스크롤링 페이지 수 증가에 따른 계산
let pageShowLimit = function(min, max, docs) {
  let i;
  let limitPages = [];
  for(i=min; i<max; i++) {
    if(docs[i] === undefined) {
      limitPages.push({ from: 'not exist'});
      return limitPages;
    }
    limitPages.push(docs[i]);
  }
  return limitPages;
}

// 데이터베이스의 모든 피드들을 가져 온다.
router.get('/allfeeds', (req, res) => {
  const allowedOrigins = ['http://127.0.0.1', 'null'];
  const origin = req.headers.origin;
  console.log(origin);
  res.setHeader('Content-Type', 'application/json; charset="utf-8"');

  // accept CORS
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Max-Age', '3600');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  ALLFeeds.find({}).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("all feeds sent");
    mostRecentlyData = docs[0].created_time; // 페이지 업로드 시, 가장 최신 데이터의 시간을 저장한다.
    fixedPrimaryDate = docs[0].created_time; // 추가 피드들을 처음 렌더링한 기준으로 불러오기 위해 쓰일 고정 시간
    let docs_8 = pageShowLimit(0, 8, docs);
    res.json(docs_8);
  });
});

// 메인 페이지에서 setInterval을 사용하여 주기적으로 피드가 업데이트 되었는지 확인한다.
router.get('/updatefeeds', (req, res) => {
  ALLFeeds.find({}).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) throw err;
    let recentFeedsArray = [];

    console.log(">>> most recently data's created time: ", mostRecentlyData);
    // 저장되어있는 최신 생성 시간으로 정보가 업데이트 되어있는지 아닌지를 확인하는 구문
    for(let i in docs) {
      if(docs[i].created_time > mostRecentlyData) {
        recentFeedsArray.push(docs[i]); // 최신 피드만 따로 저장한다.
      } else {
        mostRecentlyData = docs[0].created_time; // 가장 최신의 업데이트 피드 생성 시간 저장
        break; // 최신 피드 순으로 정렬되기 때문에, 오래된 피드를 만나면 함수 종료
      }
    }
    if(recentFeedsArray.length) {
      console.log(`[${recentFeedsArray.length}] new feeds updated!!`);
      let updated = {
        "data": recentFeedsArray
      }
      res.json(updated);
    } else {
      console.log('...no feed updated!');
      res.json({ hasUpdate: 'no' });
    }
  });
});
// 무한스크롤링 구현. 추가 피드들을 보여준다.
router.post('/morefeeds', (req, res) => {
  let result = req.body;
  if(result.type === 0) {
    ALLFeeds.find({ 'created_time': { $lte: fixedPrimaryDate } }).sort({ 'created_time': -1 }).exec(function(err, docs) {
      if(err) return res.status(400).json(err);
      console.log("more feeds sent");
      let min = 8 * (result.count - 1);
      let max = 8 * result.count;
      let docs_8 = pageShowLimit(min, max, docs);
      res.json(docs_8);
    });
  } else {
    ALLFeeds.find({ $and: [{ 'from': result.type }, {'created_time': {$lte:fixedPrimaryDate}}] }).sort({ 'created_time': -1 }).exec(function(err, docs) {
      if(err) return res.status(400).json(err);
      console.log("more feeds sent");
      let min = 8 * (result.count - 1);
      let max = 8 * result.count;
      let docs_8 = pageShowLimit(min, max, docs);
      res.json(docs_8);
    });
  }
});

module.exports = router;
