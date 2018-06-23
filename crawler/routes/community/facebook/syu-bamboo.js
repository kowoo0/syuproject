const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const conn = mongoose.connection;
const collCheck = require('../../../modules/fb-modules/check-list-collection');
const saveComments = require('../../../models/comments-store.js');

const FB = require('fb');
const getAccessToken = require('../../../modules/fb-modules/get-access-token');
const getWallFeeds = require('../../../modules/fb-modules/get-wall-feeds');

const args = { fields: ['id', 'from', 'message', 'link', 'created_time', 'full_picture', 'source'] }; // 가져올 데이터를 설정

let syuBamboo = '973432719345219/posts', bamboo = 1;
let syuDeliver = '444709775685040/posts', deliver = 1;
let syuChonghak = '387323668280049/posts', chonghak = 1;
let syuYeonhab = '1412584238989232/posts', yeonhab = 1;
let syuComputer = '451966671514736/posts', computer = 1;
let syuMain = '207112896076930/posts', main = 1;

// promise 객체로부터 '페이지 엑세스 토큰' 파리미터 값을 받음
setTimeout(function() {
  getAccessToken()
  .then((accessToken) => {
    FB.setAccessToken('EAACEdEose0cBAJFDAvccSmNtOZCQcnMwwJlVWyPHqe0MlEHlBfmze7SgTotzcB83hox6OwuVSjgLOlrUFiUzY9WJGHF07nzCj6Rrb05dHTCCqLI9T0ZBgCOtVwubrKXmGi0q1BrFUAFwKAPf3EXFder37ZB2Ap6ZCSZBmiQ5iTM8JDbKcXEeB1Rbb8bcvyWiw3jqu61wwbQZDZD'); // 엑세스 토큰 설정
    // check save comments collection exists
    collCheck('fbcomments', saveComments);
    // 멀티 프로세서 구현 시도?
    getWallFeeds(syuBamboo, args, bamboo, 1); // '대나무숲' 페이지 피드 접근
    getWallFeeds(syuDeliver, args, deliver, 2); // '대신 전해드립니다' 페이지 피드 접근
    getWallFeeds(syuChonghak, args, chonghak, 3); // '총학생회' 페이지 피드 접근
    getWallFeeds(syuYeonhab, args, yeonhab, 4); // '연합동아리' 페이지 피드 접근
    getWallFeeds(syuComputer, args, computer, 5); // '컴퓨터학부' 페이지 피드 접근
    getWallFeeds(syuMain, args, main, 6);
  }, (error) => {
    console.log(error);
  });
}, 2000);

module.exports = router;
