const express = require("express");
const { authJwt } = require("../middlewares");
var router = express.Router();
const db = require("../models");
const Profile = db.profile;
const User = db.user;

router
  .route("/")
  .post([authJwt.verifyToken], (req, res, next) => {
    const profile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      user: req.userId,
      tel: req.body.tel,
      email: req.body.email,
    };
    Profile.findOneAndUpdate({ user: req.userId }, profile, {
      new: true,
      upsert: true,
    })
      .then(
        (profile) => {
          console.log(profile);
          User.findByIdAndUpdate(
            req.userId,
            { isProfile: true },
            { new: true, upsert: true }
          ).then((user) => {
            if (user != null) {
              console.log(user);
            } else {
              err = new Error("User not Found.");
              err.status = 404;
              next(err);
            }
          });
          res.status(200).send({ message: "Profile Updated Successfully!" });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .get([authJwt.verifyToken], (req, res, next) => {
    Profile.findOne({ user: req.userId })
      .then(
        (profile) => {
          if (profile != null) {
            console.log(profile);
            return res.status(200).json(profile);
          }
          return res.status(404).send({ message: "Profile Not Found" });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

router.get("/followers", [authJwt.verifyToken], (req, res) => {
  Profile.findOne({ user: req.userId }).then((profile) => {
    if (profile != null) {
      console.log(profile);
      return res.status(200).send(profile.followers);
    } else {
      return res.status(404).send({ message: "Profile Not Found" });
    }
  });
});

router.get("/following", [authJwt.verifyToken], (req, res) => {
  Profile.findOne({ user: req.userId }).then((profile) => {
    if (profile != null) {
      console.log(profile);
      return res.status(200).send(profile.following);
    } else {
      return res.status(404).send({ message: "Profile Not Found" });
    }
  });
});

router
  .route("/:profileId/follow")
  .get([authJwt.verifyToken], (req, res, next) => {
    Profile.findOne({ user: req.userId }).then((profile) => {
      if (profile != null) {
        console.log(profile);
        const follower = profile._id;
        profile.following.push(req.params.profileId);
        Profile.findById(req.params.profileId).then((profile) => {
          if (profile != null) {
            console.log(profile);
            profile.followers.push(follower);
            profile.save().then((profile) => {
              console.log("User Added as Follower!");
            });
          } else {
            return res.status(404).send({ message: "Profile Not Found" });
          }
        });
        profile.save().then((profile) => {
          console.log("Followed the User");
          return res.status(200).send(profile);
        });
      } else {
        return res.status(404).send({ message: "Profile Not Found" });
      }
    });
  })
  .delete([authJwt.verifyToken], (req, res, next) => {
    Profile.findOne({ user: req.userId }).then((profile) => {
      if (profile != null) {
        const follower = profile._id;
        profile.following.splice(
          profile.following.indexOf(req.params.profileId),
          1
        );
        Profile.findById(req.params.profileId).then((profile) => {
          if (profile != null) {
            console.log(profile);
            profile.followers.splice(profile.followers.indexOf(follower), 1);
            profile.save().then((profile) => {
              console.log("User Removed as Follower!");
            });
          } else {
            return res.status(404).send({ message: "Profile Not Found" });
          }
        });
        profile.save().then((profile) => {
          console.log("Unfollowed the User");
          return res.status(200).send(profile);
        });
      } else {
        return res.status(404).send({ message: "Profile Not Found" });
      }
    });
  });
module.exports = router;
