require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("./bootstrap/passport");
const cors = require("cors");

const app = express();
const port = 5000;

const api = require("./api");
const bootstrap = require("./bootstrap");

bootstrap();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors(corsOptions));

app.use(api);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
