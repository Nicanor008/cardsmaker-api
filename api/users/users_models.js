const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function getRandomInt(max) {
  return Math.floor(Math.random() * 10000);
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    password: {
        type: String,
        required: false, // in case of google oauth
        default: getRandomInt(1)
    },
    defaultPassword: {
      type: Boolean,
      required: true,
      default: false
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    pictureUrl: {
        type: String,
        required: false
    },
    googleId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema)
