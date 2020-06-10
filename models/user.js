const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  photoUrl: { type: String, required: true },
  name: { type: String, required: true },
});

userSchema.methods.verifyPassword = async function (password) {
  const comparePassword = await bcrypt.compare(password, this.password);
  return comparePassword;
};

module.exports = mongoose.model("User", userSchema);
