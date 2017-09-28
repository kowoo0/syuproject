const mongoose = require('mongoose');
const conn = mongoose.connection;

const checkListCollections = (collname, targetmodel) => {
  conn.db.listCollections({ name: collname })
    .next((err, collinfo) => {
      if(err) throw err;
      // 존재하지 않을 시, 해당 컬렉션 생성
      if(!collinfo) {
        targetmodel.create((create_err, collname) => {
          if(create_err) throw create_err;
          console.log(`${collname} collection create successfully`);
        });
      }
    });
};

module.exports = checkListCollections; 
