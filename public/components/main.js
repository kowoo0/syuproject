// test
const showallFeed = $('#show-allfeed');
// test
const showfbFeed = $('#show-fbfeed');
// test
const showdcFeed = $('#show-dcfeed');
// test
const allContents = $('.all-contents');
const fbContents  = $('.fb-contents');
const dcContents  = $('.dc-contents');

let fn;
let flag = 0, monthCheck = '00', dayCheck = '00';
let type = 0;
let allPageCount = 2, fbPageCount = 2, dcPageCount = 2;
let primaryFeed;

let getDividedDate = function(contents, feed, type) {
  let date = String(feed.created_time);
  let year = date.substring(0, 4);
  let month = date.substring(4, 6);
  let day = date.substring(6, 8);
  if((flag === 1 && month === monthCheck) && day === dayCheck ) {
    return;
  }
  if(year === 'unde') { return; }
  if(type === 0) {
    contents.append(`<li class='dateBox'>${year}년 ${month}월 ${day}일</li>`);
  }
  else if(type === 1) {
    contents.append(`<li class='fbDateBox'>${year}년 ${month}월 ${day}일</li>`);
  }
  else {
    contents.append(`<li class='dcDateBox'>${year}년 ${month}월 ${day}일</li>`);
  }
  monthCheck = month;
  dayCheck = day;
  flag = 1;
}
let getDivideUpdate = function(contents, subContents, feed, type) {
  let date = String(feed.created_time), pDate = String(primaryFeed.created_time);
  let year = date.substring(0, 4), pYear = pDate.substring(0, 4);
  let month = date.substring(4, 6), pMonth = pDate.substring(4, 6);
  let day = date.substring(6, 8), pDay = pDate.substring(6, 8);

  if((flag === 1 && month === pMonth) && day === pDay ) {
    if(type === 1) {
      console.log('fb 업데이트 추가');
      $('.dateBox').first().after(getFbText(feed));
      $('.fbDateBox').first().after(getFbText(feed));
    } else {
      console.log('dc 업데이트 추가');
      $('.dateBox').first().after(getDcText(feed));
      $('.dcDateBox').first().after(getDcText(feed));
    }
    return;
  }
  contents.prepend(`<li class='dateBox'>${year}년 ${month}월 ${day}일</li>`);
  if(type === 1) {
    console.log('fb 업데이트 추가');
    subContents.prepend(`<li class='fbDateBox'>${year}년 ${month}월 ${day}일</li>`);
    $('.dateBox').first().after(getFbText(feed));
    $('.fbDateBox').first().after(getFbText(feed));
  } else {
    console.log('dc 업데이트 추가');
    subContents.prepend(`<li class='dcDateBox'>${year}년 ${month}월 ${day}일</li>`);
    $('.dateBox').first().after(getDcText(feed));
    $('.dcDateBox').first().after(getDcText(feed));
  }
  primaryFeed = feed;
  flag = 1;
}
let getFbText = function(feed) {
  let fbText = `
    <li class="content">
      <h3>삼육대학교 대나무숲</h4>
      <hr>
      <p class="fb-title">${feed.message}</p>
      <p class="created-time">${feed.created_time}</p>
    </li>
  `;
  return fbText;
}
let getDcText = function(feed) {
  let dcText = `
    <li class="content">
      <h3>디시인사이드</h4>
      <hr>
      <p class="title">${feed.message}</p>
      <a href="http://gall.dcinside.com${feed.link}">해당 페이지</a>
      <p class="dc-created-time">${feed.created_time}</p>
    </li>
  `;
  return dcText;
}
let appendByType = function(contents, feed) {
  if(feed.from === 1) {
    contents.append(getFbText(feed));
  }
  else if(feed.from === 2) {
    contents.append(getDcText(feed));
  }
  else {
    contents.append(`
      <li class="content">
        <h3>피드가 더 존재하지 않습니다.</h4>
      </li>
    `);
  }
}

// 피드 종류에 따른 슬라이드
showallFeed.bind('click', function() {
  allContents.css({'left': '0%', 'display': 'block'});
  fbContents.css({'left': '-100%', 'display': 'none'});
  dcContents.css({'left': '-100%', 'display': 'none'});
  type = 0;
});

showfbFeed.bind('click', function() {
  allContents.css({'left': '-100%', 'display': 'none'});
  fbContents.css({'left': '0%', 'display': 'block'});
  dcContents.css({'left': '-100%', 'display': 'none'});
  type = 1;
});

showdcFeed.bind('click', function() {
  allContents.css({'left': '-100%', 'display': 'none'});
  fbContents.css({'left': '-100%', 'display': 'none'});
  dcContents.css({'left': '0%', 'display': 'block'});
  type = 2;
});

// 초기 온 로드 렌더링
$(() => {
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
      primaryFeed = result[0];
      getDividedDate(allContents, result[i], 0);
      appendByType(allContents, result[i]);
    }
  }
  // 전체 피드들 렌더링
  AJAX.allfeedload('http://localhost:3000/dbrender/allfeeds', fn);
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
      getDividedDate(fbContents, result[i], 1);
      appendByType(fbContents, result[i]);
    }
  }
  // 페이스북 피드만 렌더링
  AJAX.fbfeedload('http://localhost:3000/dbrender/fbfeeds', fn);
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
      getDividedDate(dcContents, result[i], 2);
      appendByType(dcContents, result[i]);
    }
  }
  // 디시인사이드 피드만 렌더링
  AJAX.dcfeedload('http://localhost:3000/dbrender/dcfeeds', fn);
});

// 무한 스크롤링 시 렌더링
$(window).on('scroll', function(e) {
  if($(window).scrollTop() == $(document).height() - $(window).height()) {
    if(type === 0) {
      console.log('loading...more all feeds');
      // preloader('show') => 로딩 아이콘 보여주기
      // setTimeout(function( preloader('hide'); ), 1000) => AJAX 콜이 성공하면 피드 추가 후, 로딩 아이콘 숨김
      fn = (result) => {
        for(let i=0; i<result.length; i++) {
          getDividedDate(allContents, result[i]);
          appendByType(allContents, result[i]);
        }
      }
      AJAX.morefeed('http://localhost:3000/dbrender/morefeeds', allPageCount, type, fn);
      allPageCount++;
    }
    else if (type === 1) {
      console.log('loading...more facebook feeds');
      fn = (result) => {
        for(let i=0; i<result.length; i++) {
          getDividedDate(fbContents, result[i]);
          appendByType(fbContents, result[i]);
        }
      }
      AJAX.morefeed('http://localhost:3000/dbrender/morefeeds', fbPageCount, type, fn);
      fbPageCount++;
    }
    else {
      console.log('loading...more dcinside feeds');
      fn = (result) => {
        for(let i=0; i<result.length; i++) {
          getDividedDate(dcContents, result[i]);
          appendByType(dcContents, result[i]);
        }
      }
      AJAX.morefeed('http://localhost:3000/dbrender/morefeeds', dcPageCount, type, fn);
      dcPageCount++;
    }
  }
});

// 새로 업데이트 된 피드들만 렌더링
const updatedFeedRender = function() {
  let func = function(result) {
    for(let i=result.length-1; i>=0; i--) {
      if(result[i].from === 1) {
        getDivideUpdate(allContents, fbContents, result[i], result[i].from);
      } else {
        getDivideUpdate(allContents, dcContents, result[i], result[i].from);
      }
    }
  };
  AJAX.updatefeed('http://localhost:3000/dbrender/updatefeeds', func);
};
const checkLoop = setInterval(updatedFeedRender, 15000); // 15초간 간격으로 피드들을 확인 후, 새로 업데이트 된 피드가 있을 시 렌더링
