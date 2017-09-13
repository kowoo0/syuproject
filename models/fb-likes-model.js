var mongoose = require('mongoose');

// Define Schemas
var likeSchema = new mongoose.Schema({
  // story: [{ type: Schema.Types.ObjectId, ref: 'fbfeeds' }],
  storyid: Number,
  total_count: Number
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("fblikes",likeSchema);
