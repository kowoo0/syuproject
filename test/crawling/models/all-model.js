var mongoose = require('mongoose');

// Define Schemas
var feedSchema = new mongoose.Schema({
  from: Number,
  storyid: Number,
  message: String,
  link: String,
  created_time: Number
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("allfeeds", feedSchema);
