const express = require('express');
const router = express.Router();
const Allfeeds = require('../../models/fb/post.js');

router.get('/rank-slide', function(req, res) {
  let now = new Date();
  let aweekago = now.getTime() - (86400000*7);
  let criteria = new Date(aweekago);
  let year = criteria.getFullYear(),
      month = criteria.getMonth() + 1,
      date = criteria.getDate(),
      hour = criteria.getHours(),
      minute = criteria.getMinutes(),
      second = criteria.getSeconds();

  date = date < 10 ? '0' + date : date;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;

  let created_time = `${year}${month}${date}${hour}${minute}${second}`;

  Allfeeds.find({ "created_time": { $gte: Number(created_time) } }).sort({ likes: -1 }).exec(function(err, result) {
    if(err) throw err;

    if(result) {
      let dataset = [];
      let targetLength = 10;
      for(let i=0; i<targetLength; i++) {
        dataset.push(result[i]);
      }
      res.json({ data: dataset });
    } else {
      console.log('//no data');
      res.json({ data: 'empty '});
    }
  });
});

router.get('/rank-type/:typename', function(req, res) {
  let type = req.params.typename;

  let now = new Date();
  let aweekago = now.getTime() - (86400000*7);
  let criteria = new Date(aweekago);
  let year = criteria.getFullYear(),
      month = criteria.getMonth() + 1,
      date = criteria.getDate(),
      hour = criteria.getHours(),
      minute = criteria.getMinutes(),
      second = criteria.getSeconds();

  date = date < 10 ? '0' + date : date;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;

  let created_time = `${year}${month}${date}${hour}${minute}${second}`;

  Allfeeds.find({ "from": type, "created_time": { $gte: Number(created_time) } })
    .sort({ likes: -1 })
    .exec(function(err, result) {
      if(err) throw err;

      if(result) {
        let dataset = [];
        let targetLength = 3;
        for(let i=0; i<targetLength; i++) {
          dataset.push(result[i]);
        }
        res.json({ data: dataset, type: type });
      } else {
        console.log('//no data');
        res.json({ data: "empty" });
      }
    });
});

module.exports = router;
