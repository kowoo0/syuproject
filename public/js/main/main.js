// all feeds
const showallFeed = $('#show-allfeed');
// feed contents box
const allContents = $('.all-contents');

const prettyDate = moment();
moment.locale('ko');

let fn;
let flag = 0, monthCheck = '00', dayCheck = '00';
let type = 0; // 추후에, 타입에 따른 호출을 위한 변수
let allPageCount = 2; // 스크롤링 시, 카운트
let primaryFeed; // 처음 렌더링 시의 첫 번째 피드를 고정. 날짜별로 분리하기 위해

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
    contents.append(`<li class='dateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
  }
  monthCheck = month;
  dayCheck = day;
  flag = 1;
}


let getDivideUpdate = function(contents, feed, type) {
  let date = String(feed.created_time), pDate = String(primaryFeed.created_time);
  let year = date.substring(0, 4), pYear = pDate.substring(0, 4);
  let month = date.substring(4, 6), pMonth = pDate.substring(4, 6);
  let day = date.substring(6, 8), pDay = pDate.substring(6, 8);

  if((flag === 1 && month === pMonth) && day === pDay ) {
    if(type === 1) {
      console.log('fb 업데이트 추가');
      $('.dateBox').first().after(getFbText(feed));
    } else {
      console.log('dc 업데이트 추가');
      $('.dateBox').first().after(getDcText(feed));
    }
    return;
  }
  contents.prepend(`<li class='dateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
  if(type === 1) {
    console.log('fb 업데이트 추가');
    $('.dateBox').first().after(getFbText(feed));
  } else {
    console.log('dc 업데이트 추가');
    $('.dateBox').first().after(getDcText(feed));
  }
  primaryFeed = feed;
  flag = 1;
}


let compareDate = function(cTime) {
  let now = moment().format('YYYYMMDD000000');
  Number(now);
  if(cTime >= now) {
    return moment(cTime, 'YYYYMMDDhhmmss').fromNow();
  } else {
    return moment(cTime, 'YYYYMMDDhhmmss').format("M월 D일 h:mm a");
  }
}


let getFbText = function(feed) {
  if(feed.message !== undefined) {
    feed.message = feed.message.replace(/[.\n]/g, '<br>');
  } else {
    feed.message = "";
  }
  let time = compareDate(feed.created_time);
  let fbText = `
    <li class="card mb-4">
      <div class="card-body ${feed.storyid}">
        <h4 class="card-title">${feed.name}</h2>
        <p class="card-text">${feed.message}</p>
        <a href="${feed.link}" class="btn btn-primary">Read More &rarr;</a>
      </div>
      <div class="card-footer text-muted ovfl">
        <div class="img-wrap"><img src="../../images/fb-like-icon.png" width="26px" height="26px" alt=""/></div>
        <span class="txt-custom">${feed.likes}</span>
        <div class="img-wrap"><img src="../../images/fb-comment-icon.png" width="26px" height="26px" alt=""/></div>
        <span class="txt-custom">${feed.comments}</span>
      </div>
      <div class="card-footer text-muted">
        ${time} by
        <a href="#">facebook</a>
      </div>
    </li>
  `;
  return fbText;
}

let getDcText = function(feed) {
  let time = compareDate(feed.created_time);
  let dcText = `
    <li class="card mb-4">
      <div class="card-body">
        <h4 class="card-title">삼육갤</h2>
        <p class="card-text">${feed.message}</p>
        <a href="http://gall.dcinside.com${feed.link}" class="btn btn-primary">Read More &rarr;</a>
      </div>
      <div class="card-footer text-muted">
        ${time} by
        <a href="#">dcinside</a>
      </div>
    </li>
  `;
  return dcText;
}

let appendByType = function(contents, feed) {
  if(feed.from !== 'not exist') {
    contents.append(getFbText(feed));
  } else {
    contents.append(`
      <li class="card mb-4">
        <div class="card-body">
          <h4>피드가 더 존재하지 않습니다.</h4>
        </div>
      </li>
    `);
  }
}

// 초기 온 로드 렌더링
$(() => {
  // 전체 피드들 렌더링
  fn = (result) => {
    primaryFeed = result[0];
    for(let i=0; i<result.length; i++) {
      getDividedDate(allContents, result[i], 0);
      appendByType(allContents, result[i]);
    }
  }
  AJAX.allfeedload('http://localhost:3000/dbrender/allfeeds', fn);
});

// 무한 스크롤링 시 렌더링
$(window).scroll(function(e) {
  if($(document).height() <= $(window).scrollTop() + $(window).height()) {
    console.log('loading...more all feeds');
    // preloader('show') => 로딩 아이콘 보여주기
    // setTimeout(function( preloader('hide'); ), 1000) => AJAX 콜이 성공하면 피드 추가 후, 로딩 아이콘 숨김
    fn = (result) => {
      for(let i=0; i<result.length; i++) {
        getDividedDate(allContents, result[i], 0);
        appendByType(allContents, result[i]);
      }
    };
    AJAX.morefeed('http://localhost:3000/dbrender/morefeeds', allPageCount, type, fn); // 타입은 디씨, 페북 나누기 위해
    allPageCount++;
  }
});

// 새로 업데이트 된 피드들만 렌더링
const updatedFeedRender = function() {
  fn = (result) => {
    for(let i=result.length-1; i>=0; i--) {
      getDivideUpdate(allContents, result[i], 1);
    }
  };
  AJAX.updatefeed('http://localhost:3000/dbrender/updatefeeds', fn);
};
const checkLoop = setInterval(updatedFeedRender, 20000); // 15초간 간격으로 피드들을 확인 후, 새로 업데이트 된 피드가 있을 시 렌더링
