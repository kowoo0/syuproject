const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  day: Number,
  hour: Number,
  temp: Number,
  status: String,
  rainprob: String,
  humidity: String,
  temp_max : Number,
  temp_min : Number,
},
{
  versionKey: false
});

module.exports = mongoose.model("weather", weatherSchema);
