const router = require("express").Router();
const controllers = require("../../controller/user");
const passport = require("passport");

router.post("/", controllers.login);

module.exports = router;
