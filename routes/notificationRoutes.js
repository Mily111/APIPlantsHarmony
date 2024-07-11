const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/create", notificationController.createNotification);
router.get("/user/:userId", notificationController.getNotificationsForUser);
router.put(
  "/read/:notificationId",
  notificationController.markNotificationAsRead
);
// router.post("/sendNotification", notificationController.sendNotification);
module.exports = router;
