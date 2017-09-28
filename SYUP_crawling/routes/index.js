const express = require('express');
const router = express.Router();
const fbSyuBamboo  = require('./community/facebook/syu-bamboo');

router.get('/', function(req, res) {
  res.render('main.ejs');
});

router.use('/fb-syu-bamboo', fbSyuBamboo);

module.exports = router;
