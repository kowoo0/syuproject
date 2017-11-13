const casper = require('casper').create();
const target = encodeURIComponent('comm_a_03');
const fs = require('fs');
const utils = require('utils');

// var path = './data/dcinside-data.json';
var targetPage = 1;

// 번호를 반환
function getId() {
  var ids = document.querySelectorAll('table.list > tbody > tr > td.no');
  var idObj = {};

  return Array.prototype.map.call(ids, function(e) {
    var targetId = e.textContent;
    idObj = {
      id: targetId
    }
    return idObj;
  });
}

// 링크 및 타이틀 객체를 반환
function getLink() {
  // scrape the links from a href
  var links = document.querySelectorAll('table.list > tbody > tr > td.title > a');
  var linkObj = {};

  return Array.prototype.map.call(links, function(e) {
    var targetAttr = e.getAttribute('href');
    var targetText = e.textContent;
    linkObj = {
      attr: targetAttr,
      text: targetText
    }
    return linkObj;
  });
}

// 작성 시간을 반환
function getDate() {
  var dates = document.querySelectorAll('table.list > tbody > tr > td.date');
  var dateObj = {};

  return Array.prototype.map.call(dates, function(e) {
    var targetDate = e.textContent;
    dateObj = {
      date: targetDate
    }
    return dateObj;
  });
}

// 즉시 실행 함수를 통한 클로져 생성
var getFeeds = (function() {
  var pageCount = 1;  // 테스트용 카운트
  var arr = [];
  return function() {

    // url 접속
    casper.open('https://www.syu.ac.kr/web/kor/' + target);

    // 접속 후 데이터 취득
    casper.then(function() {
      var ids = this.evaluate(getId);
      var links = this.evaluate(getLink);
      var dates = this.evaluate(getDate);
      var data = {};

      // 광고 글인 0번 인덱스 제외
      for(var i=0; i<ids.length; i++) {
        data = {
          id: ids[i].id,
          attr: links[i].attr,
          text: links[i].text,
          date: dates[i].date,
        }
        arr.push(data);
      }

      console.log('end point!');
      // 모든 데이터를 담았으면 arr 객체의 내용을 data.json파일에 저장.. 이미 있으면 덮어쓰기
      fs.write('../data/syu-events-data.json', JSON.stringify(arr), 'w');
      return;
    });
  }
})();

// init
casper.start();

// UserAgent setting
casper.userAgent('User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

getFeeds();

// run and log links
casper.run();
