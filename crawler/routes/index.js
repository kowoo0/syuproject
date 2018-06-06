const express = require('express');
const router = express.Router();
const fbSyuBamboo  = require('./community/facebook/syu-bamboo');
const dcSyuGall = require('./community/dcinside/dc-syugall');
const syuInfo = require('./syuinfo/index');
const weather = require('./weather/index');

router.get('/', function(req, res) {
  res.render('main.ejs');
});

router.use('/fb-syu-bamboo', fbSyuBamboo);
router.use('/dc-syu-gall', dcSyuGall);
router.use('./save', syuInfo);
router.use('./weather', weather);

module.exports = router;
