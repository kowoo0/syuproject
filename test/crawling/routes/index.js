var express = require('express');
var router = express.Router();
var fbCrawl = require('./community/fb-syubamboo');
var dcCrawl = require('./community/dc-syugall');

router.get('/', function(req, res) {
  res.render('main.ejs');
});

router.use('/fbcrawl', fbCrawl);
router.use('/dccrawl', dcCrawl);

module.exports = router;
