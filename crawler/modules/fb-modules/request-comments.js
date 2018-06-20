const FB = require('fb');
const url = require('url');
const saveComments = require('../../models/comments-store.js');

const reqComments = (id, args, type, dataSet, cnt) => {
  FB.api(`${id}/comments`, 'get', args, (res) => {

    if(!res || res.error) {
      console.log(!res ? 'error' : res.error);
    }
    // console.log(res.data);
    if(res.data.length < 1) {
      console.log('no comments');
      return;
    }

    let test = res.data;
    for(let i=0; i<test.length; i++) {
      dataSet.push(test[i]);
      cnt++;
    }

    if(res.paging && res.paging.next) {
      let nextLink = url.parse(res.paging.next, true);
      let nextArg = {
        limit: nextLink.query.limit,
        after: nextLink.query.after,
        access_token: nextLink.query.access_token
      };

      reqComments(id, nextArg, type, dataSet, cnt);
    } else {
      // console.log(id, dataSet, count);
      let extId = id.split('_');
      let numId = Number(extId[1]);
      saveComments.findOne({ storyid: numId }, (err, find_res) => {
          if(err) throw err;

          if(find_res) {
            console.log(">>> This Comments Already Exists");
            return;
          } else {
            let data = new saveComments({
              comment_id: numId,
              data: dataSet,
              total_count: cnt
            });
            data.save((save_err, fbcomments) => {
              if(save_err) throw save_err;
            });
          }
      });
      return;
    }
  });
}

module.exports = reqComments;
