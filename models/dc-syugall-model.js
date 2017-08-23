var mongoose = require('mongoose');

// Define Schemas
var feedSchema = new mongoose.Schema({
  no: Number,
  title: String,
  link: String,
  created_time: String
},
{
  versionKey: false
});

// Create Model & export
module.exports = mongoose.model("DCfeeds", feedSchema);
