const express = require("express");
const { authJwt } = require("../middlewares");
var router = express.Router();
const db = require("../models");
const Profile = db.profile;
const User = db.user;

router.post("/profile", [authJwt.verifyToken], (req, res) => {
  const profile = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    user: req.userId,
    contactInfo: {
      tel: req.body.tel,
      email: req.body.email,
    },
  };
  Profile.findOneAndUpdate({ user: req.userId }, profile, {
    new: true,
    upsert: true,
  }).then((profile) => {
    console.log(profile);
    User.findById(req.userId).then((err, user) => {
      user.isProfile = true;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        return res
          .status(200)
          .send({ message: "Profile Updated Successfully!" });
      });
    });
  });
});
router.get("/profile", [authJwt.verifyToken], (req, res) => {
  Profile.findOne({ user: req.userId }, (err, profile) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (profile) {
      console.log(profile);
      return res.status(200).json(profile);
    }
    return res.status(404).send({ message: "Profile Not Found" });
  });
});
module.exports = router;
