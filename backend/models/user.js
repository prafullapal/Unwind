const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    isProfile: {
      type: Boolean,
      default: false
    }
    /*profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    myPosts: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },*/
  })
);
module.exports = User;
