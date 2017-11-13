var mongoose = require('mongoose');

var infoSchema = new mongoose.Schema({
  no: Number,
  category: String,
  link: String,
  text: String,
  date: String,
},
{
  versionKey: false
});

module.exports = mongoose.model("lives", infoSchema);
