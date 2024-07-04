const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");
const messageController = require("../controllers/messageController");

router.get("/available", tradeController.getAvailablePlantsForTrade);
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
router.get(
  "/availablePlantsForUser/:userId",
  tradeController.getAvailablePlantsForUser
); // Nouvelle route

// Routes pour les messages
router.post("/messages", messageController.createMessage);
router.get("/messages/user/:userId", messageController.getMessagesForUser);

// Route pour obtenir les échanges disponibles
// router.get("/available", tradeController.getAvailablePlantsForTrade);
// // Route pour créer une nouvelle offre de troc
// router.post("/create", tradeController.createTradeOffer);

// router.post("/request", tradeController.requestTrade);
// // Route pour obtenir les offres de troc pour un utilisateur spécifique
// router.get("/user/:userId", tradeController.getTradeOffersForUser);

// // Route pour mettre à jour le statut d'une offre de troc
// router.put("/status/:tradeOfferId", tradeController.updateTradeOfferStatus);

// // Route pour créer une notification
// router.post("/notifications/create", tradeController.createNotification);

// // Route pour obtenir les notifications pour un utilisateur spécifique
// router.get(
//   "/notifications/user/:userId",
//   tradeController.getNotificationsForUser
// );

// // Route pour marquer une notification comme lue
// router.put(
//   "/notifications/read/:notificationId",
//   tradeController.markNotificationAsRead
// );

module.exports = router;
