const router = require("express").Router();

const loginRoute = require("./login");
const registerRoute = require("./register");
const profileRoute = require('./profile');

router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/profile", profileRoute);
router.get('/', (req, res) => {
  console.log(req.user);
  if (req.user) {
    res.json(req.user);
  }
  res.send('home')
})

module.exports = router;
