const mongoose = require('mongoose');
const mg_config = require('../../config/mg-config');

const mongoConnect = () => {
  return new Promise((resolve) => {
    // mongoose 커넥션 객체 사용
    const conn = mongoose.connection;
    mongoose.Promise = global.Promise;
    // 이벤트 드리븐.. 연결 시 오류가 발생할 시 이벤트 호출
    conn.on("error", console.error.bind(console, "mongoose connection error:"));
    // 사용자 db로 접속..
    conn.openUri(`mongodb://${mg_config.userId}:${mg_config.userPass}@${mg_config.userLocal}:${mg_config.port}/${mg_config.db}`);
    // 디비 연결이 성공적으로 연결될 시 한 번만 실행된다.
    conn.once("open", function() {
      console.log("mongoose connect successfully..");
      resolve(true);
    });
  });
};

module.exports = mongoConnect;
