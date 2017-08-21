var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/join', function(req, res) {
  res.render('join');
});

router.post('/members', function(req,res){
 console.log(req);
 res.render('members', req.body);
});
module.exports = router;
