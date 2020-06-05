const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ipAddressSchema = new Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    cardCount: {
        type: Number,
        required: true,
        default : 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("IpAddress", ipAddressSchema)
