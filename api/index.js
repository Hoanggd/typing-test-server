const router = require("express").Router();

const loginRoute = require("./login");
const registerRoute = require("./register");
const profileRoute = require('./profile');
const resultRoute = require('./result');

router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/profile", profileRoute);
router.use('/result', resultRoute)

module.exports = router;
