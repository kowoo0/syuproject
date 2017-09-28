var mongoose = require('mongoose');

// Define Schemas
var feedSchema = new mongoose.Schema({
  from: Number,
  no: Number,
  title: String,
  link: String,
  created_time: Number
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("dcfeeds", feedSchema);
