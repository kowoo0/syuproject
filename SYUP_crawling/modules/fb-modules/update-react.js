const FB = require('fb');
const FBfeeds = require('../../models/all-model');

// Promise All를 공부하기 위해 써봄. 너무 많은 요청이 있기 때문에 추후에는 쓰지 않는 것이 바람직할듯
const updateReact = (feed_id, regExp, type) => {
    // feed/likes => 좋아요 수 요청
    let p_likes = new Promise((resolve, reject) => {
      FB.api(`${feed_id}/likes`, 'get', { summary: true }, (response) => {
        // 에러 처리
        if(!response || response.error) {
          console.log(!response ? 'error' : response.error);
          reject(response.error);
        }

        // 응답 값 = 좋아요 수
        resolve(response.summary.total_count);
      });
    });

    // feed/comments => 댓글 수 요청
    let p_comments = new Promise((resolve, reject) => {
      FB.api(`${feed_id}/comments`, 'get', { summary: true }, (response) => {
        // 에러 처리
        if(!response || response.error) {
          console.log(!response ? 'error' : response.error);
          reject(response.error);
        }

        // 응답 값 = 댓글 수
        resolve(response.summary.total_count);
      });
    });

    // 좋아요, 댓글 수 값을 업데이트
    Promise.all([p_likes, p_comments])
      .then((values) => {
        // 업데이트 쿼리
        let query = {
          $set: {
            likes: values[0],
            comments: values[1]
          }
        };
        let storyId = Number(feed_id.match(regExp));
        // 업데이트 { $and: [{ "from": type }, { "storyid": storyId }] }
        FBfeeds.update({ "storyid": storyId }, query, (update_err, result) => {
          if(update_err) throw update_err;

          // 응답 처리 보류 [댓글 수 변화 시 fbcomments 콜렉션 업데이트 필요]
          if(result.nModified === 1) {
            console.log(`# ID:[${storyId}] updated `);
          }
        });
      });
};

module.exports = updateReact;
