const mongoose = require('mongoose');

// Define Schemas
const commentSchema = new mongoose.Schema({
  // story: [{ type: Schema.Types.ObjectId, ref: 'fbfeeds' }],
  comment_id: Number,
  data: Array,
  total_count: Number
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("comment", commentSchema);
