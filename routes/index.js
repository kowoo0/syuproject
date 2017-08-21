const express = require('express');
const router = express.Router();
const dbrender = require('./dbrender/index');
const member = require('./member/index');

router.get('/', (req, res) => {
  res.render('main.ejs');
});

router.use('/dbrender', dbrender);
router.use('/member', member);

module.exports = router;
