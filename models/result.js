const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = mongoose.Schema({
  wpm: {type: Number},
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  time: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Result", resultSchema);