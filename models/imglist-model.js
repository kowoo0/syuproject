var mongoose = require('mongoose');

var imgListSchema = new mongoose.Schema({
  title: String,
  link: String,
  source: String
},
{
  versionKey: false
});

module.exports = mongoose.model("imglists", imgListSchema);
