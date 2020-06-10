const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passowrdField: "password" },
    async function (username, password, done) {
      const user = await User.findOne({ email: username }).select("+password");
      if (!user) {
        return done(null, false, {
          error: { code: "email", message: "Incorect Email" },
        });
      }
      const comparePassword = await user.verifyPassword(password);
      if (!comparePassword) {
        return done(null, false, {
          error: { code: "password", message: "Incorrect Password" },
        });
      }
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
