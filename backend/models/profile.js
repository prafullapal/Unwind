const mongoose = require("mongoose");

const ContactInfoSchema = new mongoose.Schema({
  tel: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
  },
});

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
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      contactInfo: ContactInfoSchema,
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Profile;
