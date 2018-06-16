const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  title: String,
  link: String,
  source: String
},
{
  versionKey: false
});

module.exports = mongoose.model("imglist", infoSchema);
