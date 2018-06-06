const casper = require('casper').create();
const target = encodeURIComponent('syu');
const fs = require('fs');
const utils = require('utils');

// var path = './data/dcinside-data.json';
var targetPage = 1;

// 번호를 반환
function getIds() {
  var ids = document.querySelectorAll('tr.tb > td.t_notice');
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
function getLinks() {
  // scrape the links from a href
  var links = document.querySelectorAll('td.t_subject > a:nth-child(1)');
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

// 댓글 수를 반환
function getCountOfComments() {
  var trList = document.querySelectorAll('tbody.list_tbody > tr.tb');
  var commentObj = [];

  for(var k=0; k<trList.length; k++) {
    var getComment = trList[k].querySelector('td.t_subject > a:nth-child(2) > em');
    if(getComment) {
      var textComment = getComment.innerHTML;
      var convertToNum = Number(textComment.replace(/\[/, "").replace(/\]/, ""));
      commentObj.push(convertToNum);
    } else {
      commentObj.push(0);
    }
  }

  return commentObj;
}


// 작성 시간을 반환
function getDates() {
  var dates = document.querySelectorAll('tr.tb > td.t_date');
  var dateObj = {};

  return Array.prototype.map.call(dates, function(e) {
    var targetDate = e.getAttribute('title');
    dateObj = {
      date: targetDate
    }
    return dateObj;
  });
}

// 조회 수 반환
function getHits() {
  var hit = document.querySelectorAll('tr.tb td.t_hits');
  var hitObj = [];
  var temp = {};
  for(var j=0; j<hit.length; j++) {
    // 인덱스가 짝수
    if(j%2 != 0) {
      continue;
    } else {
      temp = {
        hits: Number(hit[j].innerHTML),
        likes: Number(hit[j+1].innerHTML)
      };
      hitObj.push(temp);
    }
  }
  return hitObj;
}

// 즉시 실행 함수를 통한 클로져 생성
var getFeeds = (function() {
  var pageCount = 1;  // 테스트용 카운트
  var arr = [];
  return function() {
    if(pageCount > targetPage) {
      console.log('end point!');
      // 모든 데이터를 담았으면 arr 객체의 내용을 data.json파일에 저장.. 이미 있으면 덮어쓰기
      fs.write('../data/dcinside-data.json', JSON.stringify(arr), 'w');
      return 1;
    }
    // url 접속
    casper.open('http://gall.dcinside.com/board/lists/?id=' + target + '&page=' + pageCount);

    // 접속 후 데이터 취득
    casper.then(function() {
      var links = this.evaluate(getLinks);
      var dates = this.evaluate(getDates);
      var ids = this.evaluate(getIds);
      var comments = this.evaluate(getCountOfComments);
      var hits = this.evaluate(getHits);
      var data = {};

      // 광고 글인 0번 인덱스 제외
      for(var i=1; i<links.length; i++) {
        // 첫 페이지 공지사항 글 제외
        if(ids[i].id === '공지') {
          continue;
        }

        data = {
          id: ids[i].id,
          attr: links[i].attr,
          text: links[i].text,
          date: dates[i].date,
          comments: comments[i],
          hits: hits[i].hits,
          likes: hits[i].likes
        }
        arr.push(data);
      }

      pageCount++;
      getFeeds();
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
