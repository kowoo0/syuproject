var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('member');
});

router.post('/', function(req,res){
 // console.log(req);
 res.render('members', req.body);
});
module.exports = router;
