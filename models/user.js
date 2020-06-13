const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String, select: false },
  photoUrl: { type: String },
  name: { type: String },
  fbId: {type: String}
});

userSchema.methods.verifyPassword = async function (password) {
  const comparePassword = await bcrypt.compare(password, this.password);
  return comparePassword;
};

module.exports = mongoose.model("User", userSchema);
