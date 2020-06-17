const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const passport = require("passport");
const axios = require("axios");

const photoUrlDefault = [
  "https://secure.gravatar.com/avatar/e3b51ca72dee4ef87916ae2b9240df50.jpg?s=512&d=https%3A%2F%2Fdev.slack.com%2Fimg%2Favatars%2Fava_0010-512.v1443724322.png",
  "https://i.redd.it/k0yaetfhwta21.png",
  "https://secure.gravatar.com/avatar/123abcd123bc12b3c.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0000-512.png",
  "https://secure.gravatar.com/avatar/03a23d844bc36e58ce55dda42fc2a0c8.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2F7fa9%2Fimg%2Favatars%2Fava_0010-512.png",
  "https://gitlab.mma.club.uec.ac.jp/uploads/-/system/user/avatar/37/a46dae09db3cebd65cc482c765322699.jpg?width=36",
  "https://blog.syntonic.io/img/slackicons.png",
  "https://gitlab.mma.club.uec.ac.jp/uploads/-/system/user/avatar/37/a46dae09db3cebd65cc482c765322699.jpg?width=36",
  "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2017-03-28/160764478706_d3b35947b766cfd9bc67_512.png",
];

module.exports.createUser = async (req, res) => {
  try {
    const body = req.body;
    if (!body.email || !body.name || !body.password) {
      res.json({
        error: {
          code: "missing",
          message: "Please fill in all the fields",
        },
        user: null,
      });
      return;
    }

    const checkUser = await User.find({ email: body.email });
    if (checkUser.length) {
      res.json({
        error: {
          code: "email",
          message: "Email already exist",
        },
        user: null,
      });
      return;
    }

    const hash = await bcrypt.hash(req.body.password, 8);
    const user = new User({
      ...body,
      password: hash,
      photoUrl:
        photoUrlDefault[Math.floor(Math.random() * photoUrlDefault.length)],
    });
    const result = await user.save();

    const token = jwt.sign({ userId: result._id }, config.jwt_secret, {
      expiresIn: config.jwt_exp,
    });

    const data = {
      error: null,
      user: {
        name: result.name,
        email: result.email,
        photoUrl: result.photoUrl,
        _id: result._id,
        token,
      },
    };

    res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    console.log(info);
    if (info) {
      res.status(200).json({
        error: info,
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
        error: null,
        user: {
          email: user.email,
          photoUrl: user.photoUrl,
          name: user.name,
          token,
        },
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
      const user = await User.findOne({ fbId });
      let newUserId;
      if (!user) {
        const newUser = new User({ fbId, name: name, photoUrl });
        newUserId = newUser._id;
        await newUser.save();
      }

      const token = jwt.sign(
        {
          userId: user ? user._id : newUserId,
        },
        config.jwt_secret,
        { expiresIn: config.jwt_exp }
      );

      res.json({ name, photoUrl, token });
    }
  } catch (error) {
    console.log({ error });
  }
};
