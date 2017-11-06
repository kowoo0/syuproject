const express = require('express');
const router = express.Router();
const ALLFeeds = require('../../models/all-model');


router.get('/result', function(req,res){
  var keyword = req.query.t1;
  var search = { message : {$regex : keyword}};
  ALLFeeds.find(search).sort({ created_time: -1 }).exec(function(err,topics){
    if (err) throw err;
    res.render('search.jade', {topics:topics});
  });
});

module.exports = router;
