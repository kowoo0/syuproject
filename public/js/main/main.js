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


let getDivideUpdate = function(contents, feed) {
    contents.prepend(getFbText(feed));
}


let compareDate = function(cTime) {
  let now = moment().format('YYYYMMDD000000');
  Number(now);
  if(cTime >= now) {
    return moment(cTime, 'YYYYMMDDhhmmss').fromNow();
  } else {
    return moment(cTime, 'YYYYMMDDhhmmss').format("M월 D일 a h:mm");
  }
}


let getFbText = function(feed, count) {
  let photo = "";
  let time = compareDate(feed.created_time);
  switch(feed.from) {
    case 1:
      photo = "../../images/syu-bamboo.jpg";
      break;
    case 2:
      photo = '../../images/syu-deliver.jpg';
      break;
    case 3:
      photo = '../../images/syu-chonghak.jpg';
      break;
    case 4:
      photo = '../../images/syu-yeonhab.jpg';
      break;
    case 5:
      photo = '../../images/syu-computer.jpg';
      break;
    case 6:
      photo = '../../images/syumain.jpg';
      break;
    default:
      photo = '../../images/kakaofriends/1.jpg';
  }
  if(count === undefined) {
    count = 0;
  }
  let fbText = `
    <li class="card mb-4">
      <div class="card-body">
        <div class="card-profile ovfl">
          <div class="photo-wrap">
            <img src="${photo}" width="42px" height="42px">
          </div>
          <div class="title-wrap">
            <h5 class="card-title">${feed.name}</h5>
            <h5 class="card-time">${time}</h7>
          </div>
        </div>
        <p class="card-text">${textReduce(feed.message)}</p>
      </div>
      ${feed.picture ? hasPicture(feed.picture, feed.picture_link, feed.source) : ""}
      ${feed.source ? hasSource(feed.source, feed.picture, feed.picture_link) : ""}
      <div class="card-footer text-muted ovfl">
          ${feed.likes ? 
            `<div class="likes">
              <img src="../../images/fb-like-icon.jpg" width="20px" height="20px" alt=""><span class="txt-custom">${feed.likes}</span>
            </div>`
            : ''
          }
          ${feed.comments ? 
            `<div class="comments ${feed.storyid} comments-${count}" data-toggle="modal" data-target="#exampleModalLong">
              <img src="../../images/fb-comment-icon.jpg" width="20px" height="20px" alt="">
              <span class="txt-custom">${feed.comments}</span>
            </div>` 
            : ''
          }
          <span class="txt-custom text-muted pull-right">
          <a class="txt-link" href="${feed.link}">&rarr;</a>
        </span>
      </div>
    </li>
  `;
  return fbText;
}

let appendByType = function(contents, feed, count) {
  if (feed.from > 0 && feed.from < 7) {
    contents.append(getFbText(feed, count));
  } 
  // else {
  //   contents.append(`
  //     <li class="card mb-4">
  //       <div class="card-body">
  //         <h4>존재하지 않는 게시물입니다.</h4>
  //       </div>
  //     </li>
  //   `);
  // }
}

// 초기 온 로드 렌더링
$(() => {
  preloader('show'); 
  // 전체 피드들 렌더링
  fn = (result) => {
    primaryFeed = result[0];
    for(let i=0; i<result.length; i++) {
      appendByType(allContents, result[i]);
    }
    preloader('hide'); 
    // 어떻게 고치니~~
    showMoreText();
    $(".comments").on('click', handler);
  };
  AJAX.allfeedload('http://localhost:3000/dbrender/allfeeds', fn);

  var fn = function(result, from) {
    makeNoticeContent(result, from);
  };
  var notices = ['haksa', 'life', 'event', 'job', 'scholarship', 'org']
  for (var i=0; i<notices.length; i++) {
    AJAX.reqnotice('http://localhost:3000/syuinfo/notice/' + notices[i], fn);
  }

  fn = function(result) {
    var date = new Date();
    var curHours = date.getHours();
    console.log(curHours);
    makeWeatherContent(result, date, curHours);
  }
  AJAX.reqweatherinfo('http://localhost:3000/syuinfo/weather', fn);

  fn = function(result) {
    makeImagelistContent(result);
  }
  AJAX.reqimagelist('http://localhost:3000/syuinfo/imglist', fn);

  fn = function(result) {
    makeRankingContent(result);
  }
  AJAX.reqrankingslide('http://localhost:3000/ranking/rank-slide', fn);
  
  // 삼대전: 2, 대나무숲: 1, 삼육대학교: 6, 총학: 3, 연합: 4, 컴과: 5 
  var ranktypes = [2, 1, 6, 3, 4, 5];
  fn = function(result, type) {
    makeRankingType(result, type);
  }
  for (var i=0; i<ranktypes.length; i++) {
    AJAX.reqrankingtype('http://localhost:3000/ranking/rank-type/' + ranktypes[i], fn); // 삼대전
  }
});

let scrollFlag = true;
const preloader = function(result) {
  if(result === 'show') {
    $('.bouncing-loader').css('visibility', 'visible');
  } else {
    $('.bouncing-loader').css('visibility', 'hidden');
  }
};

// 무한 스크롤링 시 렌더링
$('.slide-1').scroll(function(e) {

  // 스크롤이 문서 아래 부분 근처에 왔을 시
  if($('.slide-1').scrollTop() >= $('.all-contents').height() - $('.slide-1').height()) {
    if(scrollFlag) {

      scrollFlag = false; // 접근 제한 플래그
      console.log('[loading..] more feeds');

      // => 로딩 아이콘 보여주기

      setTimeout(function() {
        fn = (result) => {
          // 1.2초 후, 로딩 아이콘 숨김
          for(let i=0; i<result.length; i++) {
            appendByType(allContents, result[i], allPageCount);
          }
          showMoreText(); // more(계속읽기) 적용
          $(`.comments-${allPageCount}`).on('click', handler);
          scrollFlag = true; // flag 원래대로 바꾸기
        };
        AJAX.morefeed('http://localhost:3000/dbrender/morefeeds', allPageCount, type, fn); // 타입은 디씨, 페북 나누기 위해
        allPageCount++; // allpage number up
      }, 100);
    }
  }
});

// 새로 업데이트 된 피드들만 렌더링
const updatedFeedRender = function() {
  fn = (result) => {
    for(let i=result.length-1; i>=0; i--) {
      getDivideUpdate(allContents, result[i]);
    }
    showMoreText();
    $(".comments").on('click', handler);
  };
  AJAX.updatefeed('http://localhost:3000/dbrender/updatefeeds', fn);
};
const checkLoop = setInterval(updatedFeedRender, 40000); // 15초간 간격으로 피드들을 확인 후, 새로 업데이트 된 피드가 있을 시 렌더링
