const express = require('express');
const router = express.Router();

router.get("/notice/:noticename", function(req, res) {
  let from = req.params.noticename;
  const Model = require(`../../models/info/${from}`);

  Model.find({}).sort({ "no": -1 }).exec(function(err, docs) {
    if(err) return res.status(500).send(err);

    let responseData = {
      data: docs,
      from: from
    };

    res.json(responseData);
  });
});

router.get("/weather", function(req, res) {
  const Weather = require('../../models/info/weather');

  Weather.find({}).sort({ "day": 1, "hour": 1 }).exec(function(err, docs) {
    if(err) return res.status(500).send(err);
    res.json(docs);
  });
});

router.get("/imglist", function(req, res) {
  const ImgList = require('../../models/info/banners');

  ImgList.find({}).exec(function(err, docs) {
    if(err) return res.status(500).send(err);
    res.json(docs);
  });
});

module.exports = router;
