const express = require('express');
const router = express.Router();
const dbrender = require('./dbrender/index');

router.get('/', (req, res) => {
  res.render('main.ejs');
});

router.use('/dbrender', dbrender);

module.exports = router;
