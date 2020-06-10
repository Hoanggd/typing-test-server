const config = {
  jwt_exp: 60*60,
  jwt_secret: process.env.JWT_SECRET,
  facebook_key: process.env.FACEBOOK_KEY,
  facebook_secret: process.env.FACEBOOK_SECRET,
  callback_url: "http://localhost:3000/auth/facebook/callback"
}


module.exports = config