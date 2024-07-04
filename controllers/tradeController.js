// // controllers/tradeController.js

const tradeModel = require("../models/tradeModel");

exports.getAvailablePlantsForTrade = async (req, res) => {
  try {
    const plants = await tradeModel.getAvailablePlantsForTrade();
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching available plants for trade:", error);
    res
      .status(500)
      .json({ message: "Error fetching available plants for trade" });
  }
};

exports.getAvailablePlantsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const plants = await tradeModel.getAvailablePlantsForUser(userId);
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching available plants for user:", error);
    res
      .status(500)
      .json({ message: "Error fetching available plants for user" });
  }
};

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

exports.requestTrade = async (req, res) => {
  try {
    const { requestedPlantId, userId, offeredPlantId } = req.body;
    const tradeOfferId = await tradeModel.createTradeOffer({
      requestedPlantId,
      userId,
      offeredPlantId,
    });

    // Envoyer une notification au propriétaire de la plante demandée
    const requestedPlantOwnerId = await tradeModel.getPlantOwner(
      requestedPlantId
    );
    await tradeModel.createNotification({
      userId: requestedPlantOwnerId,
      message: `Vous avez une nouvelle demande de troc de l'utilisateur ${userId}`,
      tradeOfferId,
    });

    res
      .status(201)
      .json({ message: "Trade request created successfully", tradeOfferId });
  } catch (error) {
    console.error("Error creating trade request:", error);
    res.status(500).json({ message: "Error creating trade request" });
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

exports.getAvailableTrades = async (req, res) => {
  try {
    const suggestedPlants = [
      {
        id_plante_suggested: 1,
        quantity_possess: 10,
        date_possess: "2023-07-01",
        photo: "url_to_photo",
        state_exchange: "available",
        id_user: 2,
        id_plant: 3,
        name_plant: "Rose",
      },
      // Ajoutez d'autres plantes suggérées si nécessaire
    ];
    res.status(200).json(suggestedPlants);
  } catch (error) {
    console.error("Error fetching available trades:", error);
    res.status(500).json({ message: "Error fetching available trades" });
  }
};
