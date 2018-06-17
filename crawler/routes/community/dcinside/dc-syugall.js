var express = require('express');
var router = express.Router();
var fs = require('fs');

var mongoose = require('mongoose');

var conn = mongoose.connection;
// 몽구스의 콜백 함수? 이벤트? 비동기적인 실행을 Promise를 사용해 동기적으로 실행
mongoose.Promise = global.Promise;
// 디시인사이드 피드 데이터 모델 임포트
var DCfeeds = require('../../../models/all-model');
// CasperJS로 추출한 피드 데이터 파일
var jsonData = require('../../../data/dcinside-data.json');

// Feeds를 처리하기 위한 생성자 함수
function Feeds(feeds) {
  this.feeds = JSON.parse(feeds); // JavaScript형태의 객체로 변환하여 저장
  this.save = function() {
    var datas = this.feeds;

    // 데이터베이스가 성공적으로 연결이 된 후, 피드를 저장할 이 함수를 호출
    function saveAfterConnection() {
      // 데이터베이스에 dcfeeds라는 콜렉션이 있는지 확인
      conn.db.listCollections({name: 'allfeeds'})
        .next(function(err, collinfo) {
          if(err) throw err;

          var arr = [];
          var convertDate;
          var convertId;

          // 콜렉션 없을 시, 생성
          if(!collinfo) {
            DCfeeds.create(function(err, allfeeds) {
              if(err) throw err;
              console.log("all collection create successfully!!");
            });
          }
          // 데이터 모델화
          for(var i in datas) {
            convertDate = datas[i].date.replace(/\./g, '').replace(' ', '').replace(/:/g, '');
            convertDate = Number(convertDate);
            convertId = Number(datas[i].id);

            var feedData = new DCfeeds({
              from: 007, // dcinside number
              no: convertId,
              name: "DC인사이드 삼육대 갤러리",
              message: datas[i].text,
              link: datas[i].attr,
              created_time: convertDate,
              comments: datas[i].comments,
              hits: datas[i].hits,
              likes: datas[i].likes
            });
            arr.push(feedData);
          }
          console.log("\n\ndcinside feeds save starts...");
          var count = (function(){
            var staticCount = 0;
            return staticCount;
          })();
          arr.forEach(function(feed, index) {
            // 중복 데이터가 있는지 확인 후 저장
            DCfeeds.findOne({ "no" : feed.no }, function(err, result) {
              if(err) throw err;
              if(result) {
                count++;
                console.log("dcinside feed already exists..");
                if(count > arr.length-1) {
                  process.exit(1);
                }
                return;
              } else {
                feed.save(function(err, allfeeds) {
                  if(err) throw err;
                  count++;
                  console.log("dcinside feed insert ok!");
                  if(count > arr.length-1) {
                    process.exit(1);
                  }
                  return;
                });
              }
            });
          });
        });
    }
    // setTimeout을 통해, 데이터베이스가 성공 한 후 호출, 넉넉하게 30초로 설정..
    // setTimeout(saveAfterConnection, 30000);
  }
}

jsonData = JSON.stringify(jsonData); // dcinside-data 파일을 가져옴
var saveFeeds = new Feeds(jsonData); // 인스턴스 생성
setImmediate(function() {
  saveFeeds.save(); // 호출
});

module.exports = router;
