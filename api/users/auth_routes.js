const express = require("express");
const auth = require("./auth_controllers");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.route("/register").post(auth.registerUser);
router.route("/login").post(auth.loginUser);
router.route("/verify/:email").patch(auth.verifyAccount);
router.route("/logout").post(auth.Logout);
router
  .route("/password/:email")
  .post(auth.passwordResetLink)
  .patch(auth.updateUserPassword);

//   passport auth
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

///Callback route for google to redirect
router
  .route("/google/redirect")
  .get(passport.authenticate("google"), (req, res, next) => {
    user = req.user;

    const payload = {
      id: user._id,
      email: user.email,
    };

    const FE = 'https://todo.reachlyonline.com'

    jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
      req.session.isLoggedIn = true;
      req.session.user = user._id;
      req.session.save((err) => {
        return res.redirect(`${FE}/auth/redirect/${token}/${user._id}`);
      });
    });
  });

module.exports = router;
