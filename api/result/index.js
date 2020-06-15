const router = require("express").Router();
const controller = require("../../controller/result");
const passport = require('passport');

router.get("/", controller.getResults );
router.get('/history', passport.authenticate('jwt'), controller.history)
router.post("/create", passport.authenticate('jwt') ,controller.create);

module.exports = router;
