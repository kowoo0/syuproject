const express = require('express');
const router = express.Router();
const ALLFeeds = require('../../models/all-model');
const DCFeeds = require('../../models/all-model');
const FBFeeds = require('../../models/all-model');

router.get('/allfeeds', (req, res) => {
  ALLFeeds.find({}).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("all feeds sent");
    res.json(docs);
  });
});
router.get('/fbfeeds', (req, res) => {
  FBFeeds.find({ from: 1 }).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("facebook feeds sent");
    res.json(docs);
  });
});
router.get('/dcfeeds', (req, res) => {
  DCFeeds.find({ from: 2 }).sort({ created_time: -1 }).exec(function(err, docs) {
    if(err) return res.status(400).json(err);
    console.log("dcinside feeds sent");
    res.json(docs);
  });
});

module.exports = router;
