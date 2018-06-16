const mongoose = require('mongoose');

// Define Schemas
const postSchema = new mongoose.Schema({
  from: Number,
  storyid: Number,
  no: Number,
  name: String,
  message: String,
  link: String,
  created_time: Number,
  picture: String,
  picture_link: String,
  source: String,
  likes: Number,
  comments: Number,
  hits: Number
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("allfeeds", postSchema);
