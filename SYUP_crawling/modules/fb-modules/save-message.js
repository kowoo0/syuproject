const mongoose = require("mongoose");
const conn = mongoose.connection;
const async = require('async');

const FB = require('fb');
const FBfeeds = require('../../models/all-model');
const fbDateFix = require('./date-fix');
const updateReact = require('./update-react');
const reqComments = require('./request-comments');

const saveMessage = (data, type) => {
  let feed;
  let feedList = []; // 페이스북 모델로 정의한 데이터를 담기 위한 배열
  let convertName;
  let convertMessage; // 내용
  let convertId; // 변환된 id 값
  let convertDate; // 변환된 날짜 값
  let regExp = /\d+$/g; // 페이스북의 id 토큰은 [ 페이지or유저 해시값 _ 해당 피드 해시값 ] 으로 구성. 그 중에 피드 해시값을 추출하기 위한 정규화 값
  let regExp2 = /^#[\d]+번째썰 /;  // '#0000번째썰' 해시태그 내용을 지우기 위한 정규화 값
  let regExp3 = /^삼육대학교 /;

  for(let i in data) {
    if(data[i].message === null) continue;

    // 대나무숲 피드일 경우
    if(type === 1 && data[i].message !== undefined) {
      convertMessage = data[i].message.replace(regExp2, ''); // 해시태그 내용 버리기
    } else {
      convertMessage = data[i].message;
    }
    convertName = data[i].from.name.replace(regExp3, '');
    convertId = data[i].id.match(regExp); // 쉬운 비교를 위한 아이디 값 커스텀
    convertDate = fbDateFix(data[i].created_time); // 빠른 정렬을 위한 날짜 값 커스텀

    feed = new FBfeeds({
      from: type,
      storyid: Number(convertId),
      name: convertName,
      message: convertMessage,
      link: `https://www.facebook.com/${data[i].id}/`,
      created_time: convertDate,
      picture: data[i].full_picture,
      picture_link: data[i].link,
      source: data[i].source,
      likes: 0,
      comments: 0
    });

    feedList[i] = feed;
  }

  let exists = 0;
  let inserts = 0;
  // mongodb에 저장, async.each를 사용하여 병렬 처리??를 통한 빠른 처리
  // console.log(">>> feed saving start");
  async.each(
    feedList,
    (item, callback) => {
      FBfeeds.findOne({ "storyid": item.storyid }, (err, result) => {
        if(err) throw err;

        if(result) {
          // console.log("- This feed already exists -- facebook");
          exists++;
          callback(null);
        } else {
          item.save((save_err, allfeeds) => {
            if(save_err) throw save_err;

            // console.log("- This feed was inserted -- facebook");
            inserts++;
            callback(null);
          });
        }
      });
    },
    (err) => {
      if(err) console.log(err.message);
      else {
        console.log(`@ ${convertName} >>> exist: ${exists}, insert: ${inserts}`);
        for(let i = 0; i<data.length; i++) {
          let dataSet = [];
          let cnt = 0;
          updateReact(data[i].id, regExp, type); // 해당 피드의 좋아요 수와 댓글 수를 업데이트
          reqComments(data[i].id, {}, type, dataSet, cnt);
        }
      }
    }
  )
}

module.exports = saveMessage;
