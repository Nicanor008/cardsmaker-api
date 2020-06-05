const express = require("express");
const payment = require("./payment_controller");
const isAuth = require("../users/isAuth");

const router = express.Router();

router
  .route("/")
  .post(isAuth, payment.makePayment)
  .get(isAuth, payment.getAllUserPayment);

module.exports = router;
