const casper = require('casper').create();
const target = encodeURIComponent('main.jsp');
const fs = require('fs');
const utils = require('utils');

// 링크 및 타이틀 객체를 반환
function getLink() {
  // scrape the links from a href
  var links = document.querySelectorAll('ul.visual_slider > li > a');
  var linkObj = {};

  return Array.prototype.map.call(links, function(e) {
    var targetAttr = e.getAttribute('href');
    var targetText = e.getAttribute('title');
    linkObj = {
      attr: targetAttr,
      text: targetText
    };
    return linkObj;
  });
}

// 이미지 소스를 반환
function getSource() {
  var src = document.querySelectorAll('ul.visual_slider > li > a > img');
  var srcObj = {};

  return Array.prototype.map.call(src, function(e) {
    var targetSrc = e.getAttribute('src');
    srcObj = {
      image: targetSrc
    };
    return srcObj;
  });
}

// 즉시 실행 함수를 통한 클로져 생성
var getFeeds = function() {
  var arr = [];

  // url 접속
  casper.open('https://www.syu.ac.kr/' + target);

  // 접속 후 데이터 취득
  casper.then(function() {
    var links = this.evaluate(getLink);
    var source = this.evaluate(getSource);
    var data = {};

    // 광고 글인 0번 인덱스 제외
    for(var i=0; i<links.length; i++) {
      data = {
        attr: links[i].attr,
        text: links[i].text,
        image: source[i].image
      }
      arr.push(data);
    }

    console.log('end point!');
    // 모든 데이터를 담았으면 arr 객체의 내용을 data.json파일에 저장.. 이미 있으면 덮어쓰기
    fs.write('../data/syu-image-data.json', JSON.stringify(arr), 'w');
    return;
  });
};

// init
casper.start();

// UserAgent setting
casper.userAgent('User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

getFeeds();

// run and log links
casper.run();
