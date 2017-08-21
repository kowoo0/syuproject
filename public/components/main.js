// show-menu 버튼 요소 접근
const showMenu = $('#show-menu');
// close-menu 버튼 요소 접근
const closeMenu = $('#close-menu');
// side-bar 요소 접근
const sideBar = $('#aside-bar');
// test
const showallFeed = $('#show-allfeed');
// test
const showfbFeed = $('#show-fbfeed');
// test
const showdcFeed = $('#show-dcfeed');
// test
const allContents = $('.all-contents');
const fbContents = $('.fb-contents');
const dcContents = $('.dc-contents');

// jquery 이용, show-menu 버튼 클릭 시 이벤트 발생
showMenu.bind('click', function() {
  // left: -30% => 0px 이동
  sideBar.css('left', '0px');
});

// jquery 이용, close-menu 버튼 클릭 시 이벤트 발생
closeMenu.bind('click', function() {
  // left: 0px => -30% 이동
  sideBar.css('left', '-30%');
});

let fn;
$(() => {
  // 전체 피드들 렌더링
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
      if(result[i].from === 1) {
        allContents.append(`
          <li class="content">
            <h3>삼육대학교 대나무숲</h4>
            <hr>
            <p class="fb-title">${result[i].message}</p>
            <p class="created-time">${result[i].created_time}</p>
          </li>
        `);
      } else {
        allContents.append(`
          <li class="content">
            <h3>디시인사이드</h4>
            <hr>
            <p class="title">${result[i].message}</p>
            <a href="http://gall.dcinside.com${result[i].link}">해당 페이지</a>
            <p class="dc-created-time">${result[i].created_time}</p>
          </li>
        `);
      }
    }
  }
  AJAX.allfeedload('http://localhost:3000/dbrender/allfeeds', fn);

  // 페이스북 피드만 렌더링
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
        fbContents.append(`
          <li class="content">
            <h3>삼육대학교 대나무숲</h4>
            <hr>
            <p class="fb-title">${result[i].message}</p>
            <p class="created-time">${result[i].created_time}</p>
          </li>
        `);
    }
  }
  AJAX.fbfeedload('http://localhost:3000/dbrender/fbfeeds', fn);

  // 디시인사이드 피드만 렌더링
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
        dcContents.append(`
          <li class="content">
            <h3>디시인사이드</h4>
            <hr>
            <p class="dc-title">${result[i].message}</p>
            <a href="http://gall.dcinside.com${result[i].link}">해당 페이지</a>
            <p class="created-time">${result[i].created_time}</p>
          </li>
        `);
    }
  }
  AJAX.dcfeedload('http://localhost:3000/dbrender/dcfeeds', fn);
});

// 피드 종류에 따른 슬라이드
showallFeed.bind('click', function() {
  allContents.css('left', '0%');
  fbContents.css('left', '100%');
  dcContents.css('left', '200%');
});

showfbFeed.bind('click', function() {
  allContents.css('left', '-100%');
  fbContents.css('left', '0%');
  dcContents.css('left', '100%');
});

showdcFeed.bind('click', function() {
  allContents.css('left', '-200%');
  fbContents.css('left', '-100%');
  dcContents.css('left', '0%');
});

// 새로 업데이트 된 피드들만 렌더링
const updatedFeedRender = function() {
  console.log('time test start!!');
  let func = function(result) {
    for(let i=result.length-1; i>=0; i--) {
      if(result[i].from === 1) {
        allContents.prepend(`
          <li class="content">
            <h3>삼육대학교 대나무숲</h4>
            <hr>
            <p class="fb-title">${result[i].message}</p>
            <p class="created-time">${result[i].created_time}</p>
          </li>
        `);
      } else {
        allContents.prepend(`
          <li class="content">
            <h3>디시인사이드</h4>
            <hr>
            <p class="title">${result[i].message}</p>
            <a href="http://gall.dcinside.com${result[i].link}">해당 페이지</a>
            <p class="dc-created-time">${result[i].created_time}</p>
          </li>
        `);
      }
    }
  };
  AJAX.updatefeed('http://localhost:3000/dbrender/updatefeeds', func);
};
const checkLoop = setInterval(updatedFeedRender, 15000); // 15초간 간격으로 피드들을 확인 후, 새로 업데이트 된 피드가 있을 시 렌더링
