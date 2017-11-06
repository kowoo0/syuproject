const express = require('express');
const router = express.Router();
const FBcomments = require('../../models/comments-store');

router.post('/facebook', (req, res) => {
  let id = req.body.id;
  let count = req.body.count;
  let hasMoreComment = true;
  Number(id);
  FBcomments.findOne({ 'comment_id': id }, (err, result) => {
    if(err) throw err;

    if(result) {
      console.log(`#[${id}] comment response!`);
      let data = result.data;
      let responseData = [];

      if(!data) {
        res.json("no comment///");
        return;
      }
      let min = count*8;
      let max = min+8;
      for(let i=min; i<max; i++) {
        if(data[i] === undefined) {
          hasMoreComment = false;
          continue;
        }
        if(data[i].from.name === undefined) {
          continue;
        }
        let extracted = {
          name: data[i].from.name,
          message: data[i].message,
          created_time: data[i].created_time
        }
        responseData.push(extracted);
      }

      if(hasMoreComment) {
        responseData.push({ morecomment: true });
      } else {
        responseData.push({ morecomment: false });
      }

      res.json(responseData);

    } else {
      console.log(`no data///`);
      res.json({ noComment: true });
    }
  });
});

module.exports = router;
