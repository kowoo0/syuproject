// var express = require('express');
// var router = express.Router();
// var url = require('url');
// var async = require('async');
//
// // 페이스북 API 모듈
// var FB = require('fb');
// // 페이스북 config 정보
// var fb_config = require('../../config/fb-config.json');
// // SYU BAMBOO 페이지에 접근하기 위한 피드 정보
// var feedLink = '';
//
// var mongoose = require('mongoose');
// var conn = mongoose.connection;
// // 몽구스의 콜백 함수? 이벤트? 비동기적인 실행을 Promise를 사용해 동기적으로 실행
// mongoose.Promise = global.Promise;
// // 페이스북 피드 데이터 모델 임포트
// var FBfeeds = require('../../models/all-model');
// var FBcomments = require('../../models/fb-comments-model.js');
// var FBlikes = require('../../models/fb-likes-model.js');
//
//
// // test
// var padZero = function(t) {
//   if(t<10) {
//     return '0' + t;
//   }
//   return t;
// }
// var local, month, date, hour, min, sec;
// var fbDateFix = function(date) {
//   local = new Date(date.replace(/-/g, '.').replace('T', ' ').replace('+0000', ''));
//   local.setSeconds(local.getSeconds() + 32400); // 한국 시간으로 변경
//
//   month = padZero(local.getMonth()+1);
//   date = padZero(local.getDate());
//   hour = padZero(local.getHours());
//   min = padZero(local.getMinutes());
//   sec = padZero(local.getSeconds());
//
//   var localDate = `${local.getFullYear()}${month}${date}${hour}${min}${sec}`;
//   localDate = Number(localDate);
//   return localDate;
// }
//
//
// // 페이지 접근을 위한 사용자의 앱 액세스 토큰 생성 함수
// function getAccessToken() {
//   FB.api('oauth/access_token', {
//     client_id: fb_config.clientId,
//     client_secret: fb_config.clientSecret,
//     grant_type: fb_config.grantType
//   }, function(res) {
//     if(!res || res.error) {
//       console.log(!res ? 'error occurred' : res.error);
//       return;
//     } else {
//       var count = 1; // 테스트용 카운트
//       var accessToken = res.access_token; // 응답 엑세스 토큰
//       // 엑세스 토큰 설정 - 완료되면 나의 사용자 정보로 페이스북 페이지에 접근이 허용된다.
//       FB.setAccessToken(accessToken);
//       feedLink = `${fb_config.feedLink}/posts`;
//
//       // 대나무숲 페이지 데이터 접근 함수 호출
//       getWallFeeds(feedLink, {}, count);
//
//       console.log("getAccessToken function exit..")
//     }
//   });
// }
//
// // 피드링크 정보를 가지고 대나무 숲 페이지로 이동하여 원하는 정보에 접근할 수 있다.
// function getWallFeeds(feedLink, args, count) {
//
//   // 테스트용
//   if(count > 2) {
//     return 1;
//   }
//
//   conn.db.listCollections({name: 'fbcomments'})
//     .next(function(err, collinfo) {
//       if(err) throw err;
//       // 존재하지 않을 시, fbfeeds 컬렉션 생성
//       if(!collinfo) {
//         // collection 생성
//         // 동기적 실행을 위한 mongoose.Promise = global.Promise이 필요하다.
//         FBcomments.create(function(err, fbcomments) {
//           if(err) throw err;
//           console.log("fbcomments collection create successfully!!");
//         });
//       }
//     });
//
//   conn.db.listCollections({name: 'fblikes'})
//     .next(function(err, collinfo) {
//       if(err) throw err;
//       // 존재하지 않을 시, fbfeeds 컬렉션 생성
//       if(!collinfo) {
//         // collection 생성
//         // 동기적 실행을 위한 mongoose.Promise = global.Promise이 필요하다.
//         FBlikes.create(function(err, fblikes) {
//           if(err) throw err;
//           console.log("fblikes collection create successfully!!");
//         });
//       }
//     });
//
//   // 데이터 확보
//   FB.api(feedLink, 'get', args, function(res) {
//     if(!res || res.error) {
//       console.log(!res ? 'error occured' : res.error);
//       return;
//     }
//
//     let result = res.data;
//     // 데이터 접근이 성공하면, 이 함수를 호출하여 데이터를 데이터베이스에 저장한다.
//     processMessage(result);
//
//     // 마지막 페이지는 undefined로 응답하기 때문에 검사
//     if(res.paging.next !== undefined) {
//       // 스트링으로 담겨져 오는 다음 페이지에 대한 url를 파싱한다.
//       var nextLinkParts = url.parse(res.paging.next, true);
//
//       // 새로운 객체에 페이지 갯수 제한, 다음 페이지 토큰, 액세스 토큰을 저장한다.
//       var args = {
//         limit: nextLinkParts.query.limit,
//         after: nextLinkParts.query.after,
//         access_token: nextLinkParts.query.access_token
//       };
//     } else {
//       console.log("end page!");
//       return 1;
//     }
//
//     // 재귀 함수 호출
//     getWallFeeds(feedLink, args, ++count);
//   });
// }
//
// // function test(feedLink, args) {
// //   FB.api(feedLink, 'get', args, function(res) {
// //     if(!res || res.error) {
// //       console.log(!res ? 'error occured' : res.error);
// //       return;
// //     }
// //     console.log(res);
// //   });
// // }
//
//
// // 데이터를 다루는 함수
// function processMessage(data) {
//   var arr = []; // 데이터 담을 배열 사용
//   var convertId; // id를 정규표현식을 사용하여 원하는 값을 추출한다.
//   var convertDate;
//   var regExp = /\d+$/g;
//   var feedsData;  // 데이터 모델 인스턴스를 담기 위한 변수
//
//   // 데이터베이스에서 Collection 검색 => fbfeeds
//   conn.db.listCollections({name: 'allfeeds'})
//     .next(function(err, collinfo) {
//       if(err) throw err;
//
//       // 존재하지 않을 시, fbfeeds 컬렉션 생성
//       if(!collinfo) {
//         // collection 생성
//         // 동기적 실행을 위한 mongoose.Promise = global.Promise이 필요하다.
//         FBfeeds.create(function(err, allfeeds) {
//           if(err) throw err;
//           console.log("all collection create successfully!!");
//         });
//       }
//     });
//
//     // 각 데이터에서 원하는 정보만 추출하여 디비에 저장
//     for(var i in data) {
//       if(data[i].message === null) continue;
//
//       // 정규표현식 사용
//       convertId = data[i].id.match(regExp);
//       convertDate = fbDateFix(data[i].created_time);
//
//       //
//       feedsData = new FBfeeds({
//         from: 001, // facebook number
//         storyid: Number(convertId), // 스트링형식의 값을 숫자로 변경.. 비교검색을 빠르게 하기 위해서
//         message: data[i].message,
//         link: `www.facebook.com/syubamboo/posts/${convertId}/`,
//         created_time: convertDate
//       });
//
//
//
//       arr[i] = feedsData;
//     }
//     console.log("\nfacebook feeds save start...")
//     // 사실 async 동기로 바꿀 필요 없음.. 공부해보기 위해 테스트로 써봄
//     async.each(
//       arr,
//       function(item, callback) {
//         // 이미 데이터가 저장되어 있는지 확인하기 위해..
//         FBfeeds.findOne({ "storyid": item.storyid }, function(err, feed){
//           if(err) throw err;
//           if(feed) {
//             console.log("facebook feed already exists..");
//             return;
//           } else {
//             // 데이터 저장
//             item.save(function(err, allfeeds) {
//               if(err) throw err;
//               console.log("facebook feed insert ok!");
//               return;
//             });
//           }
//         });
//       },
//       function(err, result) {
//         if(err) console.log(err.message);
//         else console.log(result);
//       }
//     )
//
//     // FBfeeds.insertMany([...arr], function(err, fbfeeds) {
//     //   if(err) throw err;
//     //   console.log("insert ok..");
//     // })
// }
//
// // 메인 실행 함수 호출
// getAccessToken();
//
// module.exports = router;
