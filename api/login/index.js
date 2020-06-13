const router = require("express").Router();
const controllers = require("../../controller/user");

router.post("/", controllers.login);
router.post("/facebook", controllers.loginWithFb)

module.exports = router;
