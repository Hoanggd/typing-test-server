const Result = require("../models/result");

module.exports.create = async (req, res) => {
  const wpm = req.body.wpm;
  const id = req.user._id;
  const result = new Result({ wpm, userId: id });
  await result.save();
  res.json({ wpm, id });
};

module.exports.getResults = async (req, res) => {
  const results = await Result.find({});
  res.json(results)
}

module.exports.history = async (req, res) => {
  const results = await Result.find({userId: req.user._id});
  res.json(results);
}