const express = require("express")
const auth = require("./auth_controllers")

const router = express.Router()

router.route("/register").post(auth.registerUser)
router.route("/login").post(auth.loginUser)
router.route("/verify/:email").patch(auth.verifyAccount)
router.route("/logout").post(auth.Logout)
router.route("/password/:email").post(auth.passwordResetLink).patch(auth.updateUserPassword)

module.exports = router
