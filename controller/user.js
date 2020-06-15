const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const passport = require("passport");
const axios = require("axios");

module.exports.createUser = async (req, res) => {
  try {
    const body = req.body;
    const hash = await bcrypt.hash(req.body.password, 8);
    const user = new User({
      ...body,
      password: hash,
      photoUrl:
        "https://avatars3.githubusercontent.com/u/35153917?s=400&u=0b339b12e149dd3c7f10bb2bbd780158631d0915&v=4",
    });
    const result = await user.save();

    const token = jwt.sign({ userId: result._id }, process.env.JWT_SECRET, {
      expiresIn: config.JWT_EXP,
    });

    res.status(200).json({
      name: result.name,
      email: result.email,
      photoUrl: result.photoUrl,
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (info && info.error) {
      res.status(401).json({
        error: info.error,
        user: null,
      });
      return;
    }

    if (user) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        config.jwt_secret,
        { expiresIn: config.jwt_exp }
      );

      res.status(200).json({
        email: user.email,
        photoUrl: user.photoUrl,
        name: user.name,
        token,
      });
    }
  })(req, res, next);
};

module.exports.loginWithFb = async (req, res) => {
  try {
    const fbId = req.body.id;
    const fbToken = req.body.accessToken;
    const photoUrl = req.body.picture.data.url;
    const name = req.body.name;
    const response = await axios({
      method: "get",
      url: "https://graph.facebook.com/v7.0/" + fbId,
      headers: { Authorization: "Bearer " + fbToken },
    });

    // if valid token
    if (response.data && response.data.id) {
      const user = await User.findOne({fbId});
      let newUserId
      if (!user) {
        const newUser = new User({ fbId, name: name, photoUrl });
        newUserId = newUser._id
        await newUser.save();
      }
      
      const token = jwt.sign(
        {
          userId: user ? user._id : newUserId,
        },
        config.jwt_secret,
        { expiresIn: config.jwt_exp }
      );

      res.json({name, photoUrl, token})
    }
  } catch (error) {
    console.log({ error });
  }
};
