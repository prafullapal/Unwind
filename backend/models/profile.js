const mongoose = require("mongoose");

const Profile = mongoose.model(
  "Profile",
  new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      tel: {
        type: Number,
      },
      email: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Profile;
