const notificationModel = require("../models/notificationModel");

exports.createNotification = async (req, res) => {
  const { userId, message, tradeOfferId } = req.body;
  console.log("Controller received request to create notification with:", {
    userId,
    message,
    tradeOfferId,
  });

  if (!userId || !message) {
    console.error("Invalid notification data:", {
      userId,
      message,
      tradeOfferId,
    });
    return res.status(400).json({ message: "Invalid parameters" });
  }

  try {
    const notificationId = await notificationModel.createNotification({
      userId,
      message,
      tradeOfferId,
    });
    console.log("Notification created with ID:", notificationId);

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
    const notifications = await notificationModel.getNotificationsForUser(
      userId
    );
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body; // Le nouveau statut est envoyé dans le corps de la requête
    const affectedRows = await notificationModel.updateNotificationStatus(
      notificationId,
      status
    );
    if (affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Notification status updated successfully" });
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({ message: "Error updating notification status" });
  }
};

exports.handleTradeNotification = async (req, res) => {
  const { tradeOfferId, status, actorUsername } = req.body;
  try {
    const tradeOffer = await tradeModel.getTradeOfferById(tradeOfferId);
    if (!tradeOffer) {
      return res.status(404).json({ message: "Trade offer not found" });
    }

    const { Id_user: requesterId, Id_user_2: receiverId } = tradeOffer;

    let userIdToNotify = requesterId;
    let message = `${actorUsername} a ${status} votre demande de troc de ${tradeOffer.requested_plant_name} avec ${tradeOffer.offered_plant_name}.`;

    if (status === "read") {
      message = `${actorUsername} a marqué votre demande de troc de ${tradeOffer.requested_plant_name} avec ${tradeOffer.offered_plant_name} comme lue.`;
    }

    await notificationModel.createNotification({
      userId: userIdToNotify,
      message,
      tradeOfferId,
    });

    // Mettre à jour le statut de la notification existante
    await notificationModel.updateNotificationStatus(tradeOfferId, status);

    res
      .status(200)
      .json({ message: "Notification created and updated successfully" });
  } catch (error) {
    console.error("Error handling trade notification:", error);
    res.status(500).json({ message: "Error handling trade notification" });
  }
};

exports.acceptTrade = async (req, res) => {
  try {
    const { tradeOfferId } = req.params;

    // Mettez à jour le statut de la demande de troc
    await tradeModel.updateTradeOfferStatus(tradeOfferId, "accepted");

    // Récupérez les informations de la demande de troc pour envoyer la notification
    const tradeOffer = await tradeModel.getTradeOfferById(tradeOfferId);
    const requesterId = tradeOffer.Id_user;

    // Envoyez la notification au demandeur
    await notificationModel.createNotification({
      userId: requesterId,
      message: `${tradeOffer.receiver_name} a accepté votre demande de troc de ${tradeOffer.offered_plant_name} avec ${tradeOffer.requested_plant_name}.`,
      tradeOfferId: tradeOfferId,
    });

    res.status(200).json({ message: "Trade accepted and notification sent" });
  } catch (error) {
    console.error("Error accepting trade:", error);
    res.status(500).json({ message: "Error accepting trade" });
  }
};

exports.rejectTrade = async (req, res) => {
  try {
    const { tradeOfferId } = req.params;

    // Mettez à jour le statut de la demande de troc
    await tradeModel.updateTradeOfferStatus(tradeOfferId, "rejected");

    // Récupérez les informations de la demande de troc pour envoyer la notification
    const tradeOffer = await tradeModel.getTradeOfferById(tradeOfferId);
    const requesterId = tradeOffer.Id_user;

    // Envoyez la notification au demandeur
    await notificationModel.createNotification({
      userId: requesterId,
      message: `${tradeOffer.receiver_name} a refusé votre demande de troc de ${tradeOffer.offered_plant_name} avec ${tradeOffer.requested_plant_name}.`,
      tradeOfferId: tradeOfferId,
    });

    res.status(200).json({ message: "Trade rejected and notification sent" });
  } catch (error) {
    console.error("Error rejecting trade:", error);
    res.status(500).json({ message: "Error rejecting trade" });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const affectedRows = await notificationModel.markNotificationAsRead(
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
