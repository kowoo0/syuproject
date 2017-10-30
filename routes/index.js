const express = require('express');
const router = express.Router();
const dbrender = require('./dbrender/index');
const member = require('./member/index');
const search = require('./search/index');
const comment = require('./comment/index');

router.get('/', (req, res) => {
  res.render('main.ejs');
});

router.use('/dbrender', dbrender); // 디비 렌더링을 위한 라우터
router.use('/member', member); // 회원가입 라우터
router.use('/search', search);
router.use('/comment', comment);

module.exports = router;
