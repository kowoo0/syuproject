const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const conn = mongoose.connection;
const collCheck = require('../../../modules/fb-modules/check-list-collection');

const FB = require('fb');
const getAccessToken = require('../../../modules/fb-modules/get-access-token');
const getWallFeeds = require('../../../modules/fb-modules/get-wall-feeds');

const args = { fields: ['id', 'from', 'message', 'created_time', 'picture'] }; // 가져올 데이터를 설정

let syuBamboo = 'TARGET_FEED_LINK/posts', bamboo = 1;
let syuDeliver = 'TARGET_FEED_LINK/posts', deliver = 1;
let syuChonghak = 'TARGET_FEED_LINK/posts', chonghak = 1;
let syuYeonhab = 'TARGET_FEED_LINK/posts', yeonhab = 1;
let syuComputer = 'TARGET_FEED_LINK/posts', computer = 1;

// promise 객체로부터 '페이지 엑세스 토큰' 파리미터 값을 받음
getAccessToken()
  .then((accessToken) => {
    FB.setAccessToken(accessToken); // 엑세스 토큰 설정
    // 멀티 프로세서 구현 시도?
    getWallFeeds(syuBamboo, args, bamboo, 1); // '대나무숲' 페이지 피드 접근
    getWallFeeds(syuDeliver, args, deliver, 2); // '대신 전해드립니다' 페이지 피드 접근
    getWallFeeds(syuChonghak, args, chonghak, 3); // '총학생회' 페이지 피드 접근
    getWallFeeds(syuYeonhab, args, yeonhab, 4); // '연합동아리' 페이지 피드 접근
    getWallFeeds(syuComputer, args, computer, 5); // '컴퓨터학부' 페이지 피드 접근
  }, (error) => {
    console.log(error);
  });

module.exports = router;
