const express = require('express');
const router = express.Router();
const DCFeeds = require('../../models/dc-syugall-model');
const FBFeeds = require('../../models/fb-syubamboo-model');

router.get('/dcfeeds', (req, res) => {
  DCFeeds.find({}).sort({ no: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("dcinside feeds sent");
    res.json(docs);
  });
})

module.exports = router;
