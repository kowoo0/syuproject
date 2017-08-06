var express = require('express');
var router = express.Router();
var fbCrawl = require('./community/fb-syubamboo');

router.get('/', function(req, res) {
  res.render('main.ejs');
});

router.use('/fbcrawl', fbCrawl);

module.exports = router;
