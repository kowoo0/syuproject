var mongoose = require('mongoose');

// Define Schemas
var feedSchema = new mongoose.Schema({
  from: Number,
  storyid: Number,
  name: String,
  message: String,
  link: String,
  created_time: Number,
  picture: String,
  likes: Number,
  comments: Number
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("allfeeds", feedSchema);
