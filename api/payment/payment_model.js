const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paid: {
        type: Boolean,
        required: true,
        default : false
    },
    amount: {
        type: String,
        required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema)
