const router = require("express").Router();
const controllers = require("../../controller/user");
const passport = require('passport')

router.post("/", controllers.login);
router.post("/facebook", controllers.loginWithFb);
router.post('/token', passport.authenticate('jwt'), (req, res) => {
  res.json(req.user);
})

module.exports = router;
