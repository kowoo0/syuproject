// all feeds
const showallFeed = $('#show-allfeed');
// facebook feeds
const showfbFeed = $('#show-fbfeed');
// dcinside feeds
const showdcFeed = $('#show-dcfeed');
// feed contents box
const allContents = $('.all-contents');
const fbContents  = $('.fb-contents');
const dcContents  = $('.dc-contents');

const prettyDate = moment();
moment.locale('ko');


let fn;
let flag = 0, monthCheck = '00', dayCheck = '00';
let type = 0;
let allPageCount = 2, fbPageCount = 2, dcPageCount = 2;
let fb_more_count = 0;
let primaryFeed;

// 피드 종류에 따른 슬라이드
showallFeed.bind('click', function() {
  allContents.css('display', 'block');
  fbContents.css('display', 'none');
  dcContents.css('display', 'none');
  type = 0;
});

showfbFeed.bind('click', function() {
  allContents.css('display', 'none');
  fbContents.css('display', 'block');
  dcContents.css('display', 'none');
  type = 1;
});

showdcFeed.bind('click', function() {
  allContents.css('display', 'none');
  fbContents.css('display', 'none');
  dcContents.css('display', 'block');
  type = 2;
});


let getDividedDate = function(contents, feed, type) {
  let date = String(feed.created_time);
  let year = date.substring(0, 4);
  let month = date.substring(4, 6);
  let day = date.substring(6, 8);
  if(type === 0 && feed.from === 1) {
    fb_more_count++;
  }
  if((flag === 1 && month === monthCheck) && day === dayCheck ) {
    return;
  }
  if(year === 'unde') { return; }
  if(type === 0) {
    contents.append(`<li class='dateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
  }
  else if(type === 1) {
    contents.append(`<li class='fbDateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
  }
  else {
    contents.append(`<li class='dcDateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
  }
  monthCheck = month;
  dayCheck = day;
  flag = 1;
}


let getDivideUpdate = function(contents, subContents, feed, type, comment, like) {
  let date = String(feed.created_time), pDate = String(primaryFeed.created_time);
  let year = date.substring(0, 4), pYear = pDate.substring(0, 4);
  let month = date.substring(4, 6), pMonth = pDate.substring(4, 6);
  let day = date.substring(6, 8), pDay = pDate.substring(6, 8);
  let comment_count;
  let like_count;

  if(type === 1) {
    for(let i=0; i<comment.length; i++) {
      if(feed.storyid !== comment[i].storyid) {
        continue;
      } else {
        comment_count = comment[i].total_count;
        break;
      }
      comment_count = '찾을 수 없음';
    }
    for(let i=0; i<like.length; i++) {
      if(feed.storyid !== like[i].storyid) {
        continue;
      } else {
        like_count = like[i].total_count;
        break;
      }
      like_count = '찾을 수 없음';
    }
  }

  if((flag === 1 && month === pMonth) && day === pDay ) {
    if(type === 1) {
      console.log('fb 업데이트 추가');
      $('.dateBox').first().after(getFbText(feed, comment_count, like_count));
      $('.fbDateBox').first().after(getFbText(feed, comment_count, like_count));
    } else {
      console.log('dc 업데이트 추가');
      $('.dateBox').first().after(getDcText(feed));
      $('.dcDateBox').first().after(getDcText(feed));
    }
    return;
  }
  contents.prepend(`<li class='dateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
  if(type === 1) {
    console.log('fb 업데이트 추가');
    subContents.prepend(`<li class='fbDateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
    $('.dateBox').first().after(getFbText(feed, comment_count, like_count));
    $('.fbDateBox').first().after(getFbText(feed, comment_count, like_count));
  } else {
    console.log('dc 업데이트 추가');
    subContents.prepend(`<li class='dcDateBox card mb-4'><div class='card-body'>${year} - ${month} - ${day}</div></li>`);
    $('.dateBox').first().after(getDcText(feed));
    $('.dcDateBox').first().after(getDcText(feed));
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


let getFbText = function(feed, comment_count, like_count) {
  feed.message = feed.message.replace(/[.\n]/g, '<br>');
  let time = compareDate(feed.created_time);
  let fbText = `
    <li class="card mb-4">
      <div class="card-body ${feed.storyid}">
        <h4 class="card-title">대나무숲</h2>
        <p class="card-text">${feed.message}</p>
        <a href="https://${feed.link}" class="btn btn-primary">Read More &rarr;</a>
      </div>
      <div class="card-footer text-muted ovfl">
        <div class="img-wrap"><img src="../../images/fb-like-icon.png" width="26px" height="26px" alt=""/></div>
        <span class="txt-custom">${like_count}</span>
        <div class="img-wrap"><img src="../../images/fb-comment-icon.png" width="26px" height="26px" alt=""/></div>
        <span class="txt-custom">${comment_count}</span>
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


let appendByType = function(contents, feed, comment, like) {
  if(feed.from === 1) {
    let comment_count;
    let like_count;
    for(let i=0; i<comment.length; i++) {
      if(feed.storyid !== comment[i].storyid) {
        continue;
      } else {
        comment_count = comment[i].total_count;
        break;
      }
      comment_count = '찾을 수 없음';
    }
    for(let i=0; i<like.length; i++) {
      if(feed.storyid !== like[i].storyid) {
        continue;
      } else {
        like_count = like[i].total_count;
        break;
      }
      like_count = '찾을 수 없음';
    }
    contents.append(getFbText(feed, comment_count, like_count));
  }
  else if(feed.from === 2) {
    contents.append(getDcText(feed));
  }
  else {
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
    let func = (getCommentAndLike) => {
      for(let i=0; i<result.length; i++) {
        primaryFeed = result[0];
        getDividedDate(allContents, result[i], 0);
        appendByType(allContents, result[i], getCommentAndLike.comment, getCommentAndLike.like);
      }
    }
    AJAX.fbcommentsload('http://localhost:3000/dbrender/fbcomment', func);
  }
  AJAX.allfeedload('http://localhost:3000/dbrender/allfeeds', fn);

  // 페이스북 피드만 렌더링
  fn = (result) => {
    let func = (getCommentAndLike) => {
      for(let i=0; i<result.length; i++) {
        getDividedDate(fbContents, result[i], 1);
        appendByType(fbContents, result[i], getCommentAndLike.comment, getCommentAndLike.like);
      }
    }
    AJAX.fbcommentsload('http://localhost:3000/dbrender/fbcomment', func);
  }
  AJAX.fbfeedload('http://localhost:3000/dbrender/fbfeeds', fn);

  // 디시인사이드 피드만 렌더링
  fn = (result) => {
    for(let i=0; i<result.length; i++) {
      getDividedDate(dcContents, result[i], 2);
      appendByType(dcContents, result[i]);
    }
  }
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
        let func = (getCommentAndLike) => {
          for(let i=0; i<result.length; i++) {
            getDividedDate(allContents, result[i], 0);
            appendByType(allContents, result[i], getCommentAndLike.comment, getCommentAndLike.like);
          }
        }
        AJAX.morecommentsload('http://localhost:3000/dbrender/morecomment', fb_more_count, func);
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
  fn = (result, fb_update_count) => {
    let func = (getCommentAndLike) => {
      for(let i=result.length-1; i>=0; i--) {
        if(result[i].from === 1) {
          getDivideUpdate(allContents, fbContents, result[i], result[i].from, getCommentAndLike.comment, getCommentAndLike.like);
        } else {
          getDivideUpdate(allContents, dcContents, result[i], result[i].from);
        }
      }
    }
    AJAX.updatecommentsload('http://localhost:3000/dbrender/updatecomment', fb_update_count, func);
  };
  AJAX.updatefeed('http://localhost:3000/dbrender/updatefeeds', fn);
};
const checkLoop = setInterval(updatedFeedRender, 20000); // 15초간 간격으로 피드들을 확인 후, 새로 업데이트 된 피드가 있을 시 렌더링
