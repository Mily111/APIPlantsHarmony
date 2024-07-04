const tradeModel = require("../models/tradeModel");

exports.createTradeOffer = async (req, res) => {
  try {
    const { requestedPlantId, userId, offeredPlantId } = req.body;
    const tradeOfferId = await tradeModel.createTradeOffer({
      requestedPlantId,
      userId,
      offeredPlantId,
    });
    res
      .status(201)
      .json({ message: "Trade offer created successfully", tradeOfferId });
  } catch (error) {
    console.error("Error creating trade offer:", error);
    res.status(500).json({ message: "Error creating trade offer" });
  }
};

exports.getTradeOffersForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tradeOffers = await tradeModel.getTradeOffersForUser(userId);
    res.status(200).json(tradeOffers);
  } catch (error) {
    console.error("Error fetching trade offers:", error);
    res.status(500).json({ message: "Error fetching trade offers" });
  }
};

exports.updateTradeOfferStatus = async (req, res) => {
  try {
    const { tradeOfferId } = req.params;
    const { status } = req.body;
    const affectedRows = await tradeModel.updateTradeOfferStatus(
      tradeOfferId,
      status
    );
    if (affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Trade offer status updated successfully" });
    } else {
      res.status(404).json({ message: "Trade offer not found" });
    }
  } catch (error) {
    console.error("Error updating trade offer status:", error);
    res.status(500).json({ message: "Error updating trade offer status" });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, message, tradeOfferId } = req.body;
    const notificationId = await tradeModel.createNotification({
      userId,
      message,
      tradeOfferId,
    });
    res
      .status(201)
      .json({ message: "Notification created successfully", notificationId });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
};

exports.getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await tradeModel.getNotificationsForUser(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const affectedRows = await tradeModel.markNotificationAsRead(
      notificationId
    );
    if (affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Notification marked as read successfully" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};
