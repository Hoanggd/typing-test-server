const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
  wpm: {type: Number},
  userId: {type: String},
  time: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Result", resultSchema);