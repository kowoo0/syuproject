const express = require('express');
const router = express.Router();
const fbSyuBamboo  = require('./community/facebook/syu-bamboo');
const dcSyuGall = require('./community/dcinside/dc-syugall');

router.get('/', function(req, res) {
  res.render('main.ejs');
});

router.use('/fb-syu-bamboo', fbSyuBamboo);
// router.use('/dc-syu-gall', dcSyuGall);

module.exports = router;
