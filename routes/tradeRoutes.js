const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");
const messageController = require("../controllers/messageController");

router.get("/available", tradeController.getAvailablePlantsForTrade);
router.post("/request", tradeController.requestTrade);
router.get("/user/:userId", tradeController.getTradeOffersForUser);
router.put(
  "/status/:tradeOfferId/:status",
  tradeController.updateTradeOfferStatus
);
router.get(
  "/availablePlantsForUser/:userId",
  tradeController.getAvailablePlantsForUser
);

router.put("/accept/:tradeOfferId", tradeController.acceptTrade);
router.put("/reject/:tradeOfferId", tradeController.rejectTrade);

// Routes pour les messages
router.post("/messages", messageController.createMessage);
router.get("/messages/user/:userId", messageController.getMessagesForUser);

// Routes pour les notifications
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
