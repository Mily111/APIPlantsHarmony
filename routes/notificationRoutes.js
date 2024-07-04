const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");

router.post("/create", tradeController.createNotification);
router.get("/user/:userId", tradeController.getNotificationsForUser);
router.put("/read/:notificationId", tradeController.markNotificationAsRead);

module.exports = router;
