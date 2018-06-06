const FB = require('fb');
const url = require('url');

const checkListCollections = require('./check-list-collection');
const saveMessage = require('./save-message');

// 원하는 커뮤니티의 링크와, 다음 피드를 얻기위한 인수 정보, 페이지 수 제한을 담는다.
const getWallFeeds = (feedLink, args, count, type) => {

  // 테스트 용, 긁어올 페이지 횟수
  if(count > 1) {
    return 1;
  }

  // 해당 페이지 피드 크롤링 요청
  FB.api(feedLink, 'get', args, (res) => {
    if(!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log(`count >> ${count}`);
    
    let data = res.data; // 인수로 설정한 필드 값이 담긴 데이터가 넘어온다.
    saveMessage(data, type); // 데이터 접근이 성공하면, 이 함수를 호출하여 데이터를 데이터베이스에 저장한다.

    let nextArgs; // 다음 페이지를 위한 인수 객체

    // 마지막 페이지는 undefined로 응답하기 때문에 검사
    if(res.paging.next !== undefined) {
      // 스트링으로 담겨져 오는 다음 페이지에 대한 url를 파싱한다.
      const nextLinkParts = url.parse(res.paging.next, true);

      // 새로운 객체에 페이지 갯수 제한, 다음 페이지 토큰, 액세스 토큰을 저장한다.
      nextArgs = {
        fields: ['id', 'from', 'message', 'link', 'created_time', 'full_picture', 'source'],
        limit: nextLinkParts.query.limit,
        after: nextLinkParts.query.after,
        access_token: nextLinkParts.query.access_token
      };
    } else {
      console.log("end page!");
      return 1;
    }
    // 재귀 함수 호출
    getWallFeeds(feedLink, nextArgs, ++count, type);
  });
};

module.exports = getWallFeeds;
