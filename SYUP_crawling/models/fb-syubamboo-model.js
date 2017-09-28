var mongoose = require('mongoose');

// Define Schemas
var feedSchema = new mongoose.Schema({
  from: Number,
  storyid: Number,
  message: String,
  created_time: Number,
  // comments: [{ type: Schema.Types.ObjectId, ref: 'fbcomments'}]
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("fbfeeds", feedSchema);
