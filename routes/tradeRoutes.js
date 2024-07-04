const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");
const messageController = require("../controllers/messageController");

router.get("/available", tradeController.getAvailablePlantsForTrade);
router.post("/request", tradeController.requestTrade);
router.get("/user/:userId", tradeController.getTradeOffersForUser);
router.put("/status/:tradeOfferId", tradeController.updateTradeOfferStatus);
router.get(
  "/availablePlantsForUser/:userId",
  tradeController.getAvailablePlantsForUser
); // Nouvelle route

// Routes pour les messages
router.post("/messages", messageController.createMessage);
router.get("/messages/user/:userId", messageController.getMessagesForUser);

module.exports = router;
