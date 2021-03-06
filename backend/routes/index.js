var express = require("express");
var router = express.Router();
const db = require("../models");

var usersRouter = require("./users");
var authRouter = require("./authorization");
var postRouter = require("./posts");
var profileRouter = require("./profile");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Unwind" });
});

router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);
router.use("/user/posts", postRouter);
router.use("/user/profile", profileRouter);

module.exports = router;
