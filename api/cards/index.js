const express = require("express");
const cardsRoutes = require("./cards_controllers");
const isAuth = require("../users/isAuth");

const router = express.Router();

router
  .route("/")
  .post(isAuth, cardsRoutes.createCard)
  .get(cardsRoutes.getAllEventsCards);
router
  .route("/:id")
  .get(cardsRoutes.getSingleCard)
  .patch(isAuth, cardsRoutes.updateUserEvent)
  .delete(isAuth, cardsRoutes.deleteUserEvent);
router
  .route("/user/all")
  .get(isAuth, cardsRoutes.getUserEventCards)
  .delete(isAuth, cardsRoutes.deleteAllUserEventCards);
router.route("/tags/:tag").get(cardsRoutes.viewCardsTags);
router.route("/search/:name").get(cardsRoutes.searchEventCard)

module.exports = router;
