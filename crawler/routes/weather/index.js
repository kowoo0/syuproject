const express = require('express');
const router = express.Router();

// 기상 RSS
const RSS = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1135060000';

// module load
const client = require('cheerio-httpcli');

// weather model
const Weather = require('../../models/weather-model')

function saveWeather(data) {
  for(let i=0; i<data.length; i++) {
    let item = data[i];
    let query = {
      $set: {
        temp: item.temp,
        status: item.status,
        rainprob: item.rainprob,
        humidity: item.humidity,
        temp_max: item.temp_max,
        temp_min: item.temp_min
      }
    }

    Weather.findOneAndUpdate({"day": item.day, "hour": item.hour}, query, {upsert: true}, function(err, result) {
      if(err) throw err;
      console.log(result);
    });
  }
}


// RSS download
client.fetch(RSS, {}, function(err, $, res) {
  if(err) {
      console.log(err);
      return;
  }

  const dataset = [];

  // 오늘, 내일, 모레 날씨 추출
  $("body > data").each(function(idx) {

    let item = {
      day: Number($(this).find('day').text()),
      hour: Number($(this).find('hour').text()),
      temp: Math.round(Number($(this).find('temp').text())),
      status: $(this).find('wfKor').text(),
      rainprob: $(this).find('pop').text(),
      humidity: $(this).find('reh').text(),
      temp_max : Math.round(Number($(this).find('tmx').text())),
      temp_min : Math.round(Number($(this).find('tmn').text()))
    }

    let data = new Weather(item);
    dataset.push(data);
  });

  setTimeout(function() {
    saveWeather(dataset);
  }, 2000);
});

module.exports = router;
