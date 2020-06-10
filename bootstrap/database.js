const mongoose = require("mongoose");
const connectDb = () => {
  mongoose.connect("mongodb://localhost/typing-test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("db connected");
  });
};

module.exports = connectDb;
