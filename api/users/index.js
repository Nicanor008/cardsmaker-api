const express = require("express");
const users = require("./users_controllers");
const isAuth = require("./isAuth");

const router = express.Router();

router.route("/").get(users.fetchAllUsers);
router
  .route("/:id")
  .get(users.getSingleUser)
  .patch(isAuth, users.updateUserAccount)
  .delete(isAuth, users.deleteUserAccount);
router.route("/deactivate/:id").patch(isAuth, users.softDeleteUserAccount);

module.exports = router;
