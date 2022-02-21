const express = require("express");
const { authJwt } = require("../middlewares");
var router = express.Router();
const db = require("../models");
const Profile = db.profile;
const User = db.user;

router
  .route("/", [authJwt.verifyToken])
  .post((req, res, next) => {
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
    })
      .then(
        (profile) => {
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
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .get((req, res, next) => {
    Profile.findOne({ user: req.userId })
      .then(
        (profile) => {
          if (profile) {
            console.log(profile);
            return res.status(200).json(profile);
          }
          return res.status(404).send({ message: "Profile Not Found" });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = router;
