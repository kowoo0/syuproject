const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  no: Number,
  category: String,
  link: String,
  text: String,
  date: String,
},
{
  versionKey: false
});

module.exports = mongoose.model("job", infoSchema);
