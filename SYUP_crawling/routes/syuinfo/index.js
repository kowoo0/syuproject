const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const conn = mongoose.connection;
mongoose.Promise = global.Promise;

// 삼육대학교 정보 JSON 파일
const haksa = require('../../data/syu-haksa-data.json');
const life = require('../../data/syu-life-data.json');
const events = require('../../data/syu-events-data.json');
const job = require('../../data/syu-job-data.json');
const scholarship = require('../../data/syu-scholarship-data.json');
const org = require('../../data/syu-org-data.json');
const imgList = require('../../data/syu-image-data.json');

// 삼육대학교 정보 모델
const Haksa = require('../../models/haksa-model');
const Life = require('../../models/life-model');
const Events = require('../../models/events-model');
const Job = require('../../models/job-model');
const Scholarship = require('../../models/scholarship-model');
const Org = require('../../models/org-model');
const ImgList = require('../../models/imglist-model');

function isJSON(file) {
  if(typeof file === 'object') {
    return file;
  } else {
    return JSON.parse(file);
  }
}

function getModelItem(Model, data, cg) {
  return new Model({
    no: Number(data.id),
    category: cg,
    link: data.attr,
    text: data.text.replace(/^\[[^\d]+\] ?/, ""),
    date: data.date.split(' ')[0]
  });
}

function getDataSet(data, model) {
  let dataset = [];
  let length = data.length;

  for(let i=0; i<length; i++) {
    // id가 '공지'인지 체크
    if(data[i].id === "") {
        data[i].id = 9999;
        let item = getModelItem(model, data[i], '공지');
        dataset.push(item);
        continue;
    }

    let regExp = /^\[[^\d]+\]/; // [ ] 카테고리 추출 : 없으면 '일반'
    let extractId = data[i].text.match(regExp); // null 혹은 배열 반환

    if(extractId === null) {
      let item = getModelItem(model, data[i], '일반');
      dataset.push(item);
    } else {
      let item = getModelItem(model, data[i], extractId[0]);
      dataset.push(item);
    }
  }

  return dataset;
}

function dataSave(dataset, Model, collection) {
  let length = dataset.length;

  for(let i=0; i<length; i++) {
    // 공지는 따로 비교할 번호가 없어 문자열로 비교
    let data = dataset[i];
    if(data.no === 0) {
      Model.findOne({ "text": data.text }, function(err, result) {
        if(err) throw err;
        if(result) {
          console.log(">> exists");
          return;
        } else {
          data.save(function(err, collection) {
            if(err) throw err;
            return;
          })
        }
        console.log(">> inserts");
      });
    } else {
      Model.findOne({ "no": data.no }, function(err, result) {
        if(err) throw err;
        if(result) {
          console.log(">> exists");
          return;
        } else {
          data.save(function(err, collection) {
            if(err) throw err;
            console.log(">> inserts");
            return;
          })
        }
      });
    }
  }

}

function imgSave(imgs, Model) {
  isJSON(imgs);

  let imgset = [];
  for(let i=0; i<imgs.length; i++) {
    let item = new Model({
      title: imgs[i].text,
      link: imgs[i].attr,
      source: `https://www.syu.ac.kr/${imgs[i].image}`
    });
    imgset.push(item);
  }

  for(let i=0; i<imgset.length; i++) {
    let item = imgset[i];
    Model.findOne({ "title": item.title }, function(err, result) {
      if(err) throw err;
      if(result) {
        console.log(">> exists image");
        return;
      } else {
        item.save(function(err, imglists) {
          if(err) throw err;
          console.log(">> image inserts");
          return;
        });
      }
    });
  }
}

setTimeout(function() {
  isJSON(haksa);
  isJSON(life);
  isJSON(events);
  isJSON(job);
  isJSON(scholarship);
  isJSON(org);
  let result1 = getDataSet(haksa, Haksa);
  let result2 = getDataSet(life, Life);
  let result3 = getDataSet(events, Events);
  let result4 = getDataSet(job, Job);
  let result5 = getDataSet(scholarship, Scholarship);
  let result6 = getDataSet(org, Org);
  dataSave(result1, Haksa, 'haksas');
  dataSave(result2, Life, 'lives');
  dataSave(result3, Events, 'events');
  dataSave(result4, Job, 'jobs');
  dataSave(result5, Scholarship, 'scholarships');
  dataSave(result6, Org, 'orgs');
//   imgSave(imgList, ImgList);
}, 2000);


module.exports = router;
