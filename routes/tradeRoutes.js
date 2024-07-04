// routes/tradeRoutes.js

const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");

router.get("/available", tradeController.getAvailableTrades);
router.post("/create", tradeController.createTradeOffer);
router.get("/user/:userId", tradeController.getTradeOffersForUser);
router.put("/status/:tradeOfferId", tradeController.updateTradeOfferStatus);
router.post("/notifications/create", tradeController.createNotification);
router.get(
  "/notifications/user/:userId",
  tradeController.getNotificationsForUser
);
router.put(
  "/notifications/read/:notificationId",
  tradeController.markNotificationAsRead
);

module.exports = router;
