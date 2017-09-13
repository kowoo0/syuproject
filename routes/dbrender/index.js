const express = require('express');
const router = express.Router();
const ALLFeeds = require('../../models/all-model');
const DCFeeds = require('../../models/all-model');
const FBFeeds = require('../../models/all-model');
const FBComments = require('../../models/fb-comments-model');
const FBLikes = require('../../models/fb-likes-model');

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
  ALLFeeds.find({}).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("all feeds sent");
    mostRecentlyData = docs[0].created_time; // 페이지 업로드 시, 가장 최신 데이터의 시간을 저장한다.
    fixedPrimaryDate = docs[0].created_time; // 추가 피드들을 처음 렌더링한 기준으로 불러오기 위해 쓰일 고정 시간
    let docs_25 = pageShowLimit(0, 25, docs);
    res.json(docs_25);
  });
});
// 페북만 가져옴
router.get('/fbfeeds', (req, res) => {
  FBFeeds.find({ 'from': 1 }).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("facebook feeds sent");
    let docs_25 = pageShowLimit(0, 25, docs);
    res.json(docs_25);
  });
});
// 디시인사이드만 가져옴
router.get('/dcfeeds', (req, res) => {
  DCFeeds.find({ 'from': 2 }).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("dcinside feeds sent");
    let docs_25 = pageShowLimit(0, 25, docs);
    res.json(docs_25);
  });
});
// 메인 페이지에서 setInterval을 사용하여 주기적으로 피드가 업데이트 되었는지 확인한다.
router.get('/updatefeeds', (req, res) => {
  ALLFeeds.find({}).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) throw err;
    // 저장되어있는 최신 생성 시간으로 정보가 업데이트 되어있는지 아닌지를 확인하는 구문
    let arr = [];
    let fb_update_count = 0;
    console.log('mostRecentlyData: ', mostRecentlyData); //
    for(let i in docs) {
      if(docs[i].created_time > mostRecentlyData) {
        if(docs[i].from === 1) {
          fb_update_count++;
        }
        arr.push(docs[i]); // 최신 피드만 따로 저장한다.
      } else {
        mostRecentlyData = docs[0].created_time;
        console.log("End point of Updated Data");
        break; // 최신 피드 순으로 정렬되기 때문에, 오래된 피드를 만나면 함수 종료
      }
    }
    if(arr.length) {
      console.log(`${arr.length} new feeds updated!!`);
      let updated = {
        "fb_count": fb_update_count,
        "data": arr
      }
      res.json(updated);
    } else {
      console.log('feeds not updated');
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
      let min = 25 * (result.count - 1);
      let max = 25 * result.count;
      let docs_25 = pageShowLimit(min, max, docs);
      res.json(docs_25);
    });
  } else {
    ALLFeeds.find({ $and: [{ 'from': result.type }, {'created_time': {$lte:fixedPrimaryDate}}] }).sort({ 'created_time': -1 }).exec(function(err, docs) {
      if(err) return res.status(400).json(err);
      console.log("more feeds sent");
      let min = 25 * (result.count - 1);
      let max = 25 * result.count;
      let docs_25 = pageShowLimit(min, max, docs);
      res.json(docs_25);
    });
  }
});

// 댓글 수를 가져 온다.
router.get('/fbcomment', (req, res) => {
  FBComments.find({}).sort({ 'storyid': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    let comments_25 = pageShowLimit(0, 25, docs);
    FBLikes.find({}).sort({ 'storyid': -1 }).exec(function(err_2, docs_2) {
      if(err_2) return res.status(400).json(err_2);
      let likes_25 = pageShowLimit(0, 25, docs_2)
      let both = {
        "comment": comments_25,
        "like": likes_25
      };
      res.json(both);
    });
  });
});

// 스크롤링 시, 댓글 수를 가져 온다.
router.post('/morecomment', (req, res) => {
  let result = req.body;
  FBComments.find({ 'created_time': { $lte: fixedPrimaryDate } }).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    let min = result.count;
    let max = result.count + 25;
    let comments_25 = pageShowLimit(min, max, docs);
    FBLikes.find({ 'created_time': { $lte: fixedPrimaryDate } }).sort({ 'created_time': -1 }).exec(function(err_2, docs_2) {
      if(err_2) return res.status(400).json(err_2);

      let likes_25 = pageShowLimit(min, max, docs_2);
      let both = {
        "comment": comments_25,
        "like": likes_25
      };
      res.json(both);
    });
  });
});

// 업데이트 시, 댓글 수를 가져 온다.
router.post('/updatecomment', (req, res) => {
  let result = req.body;
  FBComments.find({}).sort({ 'created_time': -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);

    // 저장되어있는 최신 생성 시간으로 정보가 업데이트 되어있는지 아닌지를 확인하는 구문
    let min = 0;
    let max = result.count;
    let comments_25 = pageShowLimit(min, max, docs);
    FBLikes.find({}).sort({ 'created_time': -1 }).exec(function(err_2, docs_2) {
      if(err_2) return res.status(400).json(err_2);

      let likes_25 = pageShowLimit(min, max, docs_2);
      let both = {
        "comment": comments_25,
        "like": likes_25
      };
      res.json(both);
    });
  });
});

module.exports = router;
