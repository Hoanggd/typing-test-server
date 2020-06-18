const mongoose = require("mongoose");
const connectDb = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0-v7eju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("db connected");
  });
};

module.exports = connectDb;
