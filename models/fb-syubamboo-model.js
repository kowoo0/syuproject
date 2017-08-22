var mongoose = require('mongoose');

// Define Schemas
var feedSchema = new mongoose.Schema({
  storyid: Number,
  message: String,
  created_time: String
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("FBfeeds", feedSchema);
