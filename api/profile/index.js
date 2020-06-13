const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('jwt'), (req, res) => {
  res.json(req.user);
})

module.exports = router