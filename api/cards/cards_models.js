const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "white",
    },
    border: {
      type: String,
      default: "dotted",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    useTemplate: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [{}],
    ip: {
      type: Schema.Types.ObjectId,
      ref: 'IpAddress',
      required: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardsSchema);
