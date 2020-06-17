const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user");
const config = require("../config");

const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

passport.use(
  new LocalStrategy(
    { usernameField: "email", passowrdField: "password" },
    async function (username, password, done) {
      const user = await User.findOne({ email: username }).select("+password");
      if (!user) {
        return done(null, false, {
          message: "Incorect Email",
        });
      }
      const comparePassword = await user.verifyPassword(password);
      if (!comparePassword) {
        return done(null, false, {
          message: "Incorrect Password",
        });
      }
      return done(null, user);
    }
  )
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwt_secret;
passport.use(
  new JwtStrategy(opts, async function (jwtPayload, done) {
    const user = await User.findById(jwtPayload.userId);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: config.facebook_key,
//       clientSecret: config.facebook_secret,
//       callbackURL: "http://localhost:5000/login/facebook/callback",
//       profileFields: ["id", "displayName", "picture.type(large)"],
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       const user = await User.findOneAndUpdate({fbId: profile.id}, {}, {upsert: true})
//       user.save();
//       return cb(null, {
//         fbId: profile.id,
//         fbToken: accessToken
//       });
//     }
//   )
// );

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
