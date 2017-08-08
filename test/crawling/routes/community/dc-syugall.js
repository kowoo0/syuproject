var express = require('express');
var router = express.Router();
var fs = require('fs');

var mongoose = require('mongoose');

var conn = mongoose.connection;
// 몽구스의 콜백 함수? 이벤트? 비동기적인 실행을 Promise를 사용해 동기적으로 실행
mongoose.Promise = global.Promise;
// 디시인사이드 피드 데이터 모델 임포트
var DCfeeds = require('../../models/dc-syugall-model');
// CasperJS로 추출한 피드 데이터 파일
var jsonData = require('../../data/dcinside-data.json');

// Feeds를 처리하기 위한 생성자 함수
function Feeds(feeds) {
  this.feeds = JSON.parse(feeds); // JavaScript형태의 객체로 변환하여 저장
  this.save = function() {
    var datas = this.feeds;

    // 데이터베이스가 성공적으로 연결이 된 후, 피드를 저장할 이 함수를 호출
    function saveAfterConnection() {
      // 데이터베이스에 dcfeeds라는 콜렉션이 있는지 확인
      conn.db.listCollections({name: 'dcfeeds'})
        .next(function(err, collinfo) {
          if(err) throw err;

          var arr = [];
          var feedData;
          // 콜렉션 없을 시, 생성
          if(!collinfo) {
            DCfeeds.create(function(err, dcfeeds) {
              if(err) throw err;
              console.log("dcinside collection create successfully!!");
            });
          }
          // 데이터 모델화
          for(var i in datas) {
            feedData = new DCfeeds({
              no: datas[i].id,
              title: datas[i].text,
              link: datas[i].attr,
              created_time: datas[i].date
            });
            arr.push(feedData);
          }
          console.log("\n\ndcinside feeds save starts...");
          arr.forEach(function(feed, index) {
            // 중복 데이터가 있는지 확인 후 저장
            DCfeeds.findOne({ "no" : feed.no }, function(err, result) {
              if(err) throw err;

              if(result) {
                console.log("dcinside feed already exists..");
                return;
              } else {
                feed.save(function(err, dcfeeds) {
                  if(err) throw err;
                  console.log("dcinside feed insert ok!");
                });
              }
            });
          });
        });
    }
    // setTimeout을 통해, 데이터베이스가 성공 한 후 호출, 넉넉하게 5초로 설정..
    setTimeout(saveAfterConnection, 5000);
  }
}

jsonData = JSON.stringify(jsonData); // dcinside-data 파일을 가져옴
var saveFeeds = new Feeds(jsonData); // 인스턴스 생성
saveFeeds.save(); // 호출

module.exports = router;
