// // // controllers/tradeController.js

// const tradeModel = require("../models/tradeModel");

// exports.getAvailablePlantsForTrade = async (req, res) => {
//   try {
//     const plants = await tradeModel.getAvailablePlantsForTrade();
//     res.status(200).json(plants);
//   } catch (error) {
//     console.error("Error fetching available plants for trade:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching available plants for trade" });
//   }
// };

// exports.getAvailablePlantsForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const plants = await tradeModel.getAvailablePlantsForUser(userId);
//     res.status(200).json(plants);
//   } catch (error) {
//     console.error("Error fetching available plants for user:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching available plants for user" });
//   }
// };

// exports.createTradeOffer = async (req, res) => {
//   try {
//     const { requestedPlantId, userId, offeredPlantId } = req.body;
//     const tradeOfferId = await tradeModel.createTradeOffer({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });

//     // Récupérer les informations des plantes et des utilisateurs pour la notification
//     const requestedPlant = await tradeModel.getPlantById(requestedPlantId);
//     const offeredPlant = await tradeModel.getPlantById(offeredPlantId);
//     const requestedPlantOwner = requestedPlant.Id_user;
//     const offeredPlantName = offeredPlant.name_plant;
//     const requestedPlantName = requestedPlant.name_plant;

//     const message = `L'utilisateur ${userId} vous demande si vous acceptez sa demande de troc : échange de ${offeredPlantName} contre ${requestedPlantName}.`;

//     // Créer une notification pour le propriétaire de la plante demandée
//     await tradeModel.createNotification({
//       userId: requestedPlantOwner,
//       message,
//       tradeOfferId,
//     });

//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade offer:", error);
//     res.status(500).json({ message: "Error creating trade offer" });
//   }
// };

// exports.requestTrade = async (req, res) => {
//   try {
//     const { requestedPlantId, userId, offeredPlantId } = req.body;
//     const tradeOfferId = await tradeModel.createTradeOffer({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });
//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade request:", error);
//     res.status(500).json({ message: "Error creating trade request" });
//   }
// };

// exports.getTradeOffersForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const tradeOffers = await tradeModel.getTradeOffersForUser(userId);
//     res.status(200).json(tradeOffers);
//   } catch (error) {
//     console.error("Error fetching trade offers:", error);
//     res.status(500).json({ message: "Error fetching trade offers" });
//   }
// };
// exports.acceptTrade = async (req, res) => {
//   try {
//     const tradeOfferId = req.params.tradeOfferId;
//     await TradeModel.updateTradeStatus(tradeOfferId, "accepted");
//     res.status(200).json({ message: "Trade accepted successfully" });
//   } catch (error) {
//     console.error("Error accepting trade:", error);
//     res.status(500).json({ message: "Error accepting trade" });
//   }
// };

// exports.rejectTrade = async (req, res) => {
//   try {
//     const tradeOfferId = req.params.tradeOfferId;
//     await TradeModel.updateTradeStatus(tradeOfferId, "rejected");
//     res.status(200).json({ message: "Trade rejected successfully" });
//   } catch (error) {
//     console.error("Error rejecting trade:", error);
//     res.status(500).json({ message: "Error rejecting trade" });
//   }
// };

// exports.updateTradeOfferStatus = async (req, res) => {
//   const tradeOfferId = req.params.tradeOfferId;
//   const status = req.params.status;

//   if (!tradeOfferId || !status) {
//     return res.status(400).json({ message: "Invalid parameters" });
//   }

//   try {
//     const result = await tradeModel.updateTradeOfferStatus(
//       tradeOfferId,
//       status
//     );
//     return res.json(result);
//   } catch (error) {
//     console.error("Error updating trade offer status:", error);
//     return res.status(500).json({ message: "Database error" });
//   }
// };

// exports.createNotification = async (req, res) => {
//   try {
//     const { userId, message, tradeOfferId } = req.body;
//     const notificationId = await tradeModel.createNotification({
//       userId,
//       message,
//       tradeOfferId,
//     });
//     res
//       .status(201)
//       .json({ message: "Notification created successfully", notificationId });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     res.status(500).json({ message: "Error creating notification" });
//   }
// };

// exports.getNotificationsForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const notifications = await tradeModel.getNotificationsForUser(userId);
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ message: "Error fetching notifications" });
//   }
// };

// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     const affectedRows = await tradeModel.markNotificationAsRead(
//       notificationId
//     );
//     if (affectedRows > 0) {
//       res
//         .status(200)
//         .json({ message: "Notification marked as read successfully" });
//     } else {
//       res.status(404).json({ message: "Notification not found" });
//     }
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     res.status(500).json({ message: "Error marking notification as read" });
//   }
// };

// exports.getAvailableTrades = async (req, res) => {
//   try {
//     const suggestedPlants = [
//       {
//         id_plante_suggested: 1,
//         quantity_possess: 10,
//         date_possess: "2023-07-01",
//         photo: "url_to_photo",
//         state_exchange: "available",
//         id_user: 2,
//         id_plant: 3,
//         name_plant: "Rose",
//       },

//     ];
//     res.status(200).json(suggestedPlants);
//   } catch (error) {
//     console.error("Error fetching available trades:", error);
//     res.status(500).json({ message: "Error fetching available trades" });
//   }
// };

// const tradeModel = require("../models/tradeModel");

// exports.getAvailablePlantsForTrade = async (req, res) => {
//   try {
//     const plants = await tradeModel.getAvailablePlantsForTrade();
//     res.status(200).json(plants);
//   } catch (error) {
//     console.error("Error fetching available plants for trade:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching available plants for trade" });
//   }
// };

// exports.getAvailablePlantsForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const plants = await tradeModel.getAvailablePlantsForUser(userId);
//     res.status(200).json(plants);
//   } catch (error) {
//     console.error("Error fetching available plants for user:", error);
//     res
//       .status(500)
//       .json({ message: "Error fetching available plants for user" });
//   }
// };

// exports.createTradeOffer = async (req, res) => {
//   try {
//     const { requestedPlantId, userId, offeredPlantId } = req.body;
//     const tradeOfferId = await tradeModel.createTradeOffer({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });

//     const requestedPlant = await tradeModel.getPlantById(requestedPlantId);
//     const offeredPlant = await tradeModel.getPlantById(offeredPlantId);
//     const requestedPlantOwner = requestedPlant.Id_user;
//     const offeredPlantName = offeredPlant.name_plant;
//     const requestedPlantName = requestedPlant.name_plant;

//     const message = `L'utilisateur ${userId} vous demande si vous acceptez sa demande de troc : échange de ${offeredPlantName} contre ${requestedPlantName}.`;

//     await tradeModel.createNotification({
//       userId: requestedPlantOwner,
//       message,
//       tradeOfferId,
//     });

//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade offer:", error);
//     res.status(500).json({ message: "Error creating trade offer" });
//   }
// };

// // exports.requestTrade = async (req, res) => {
// //   try {
// //     const { requestedPlantId, userId, offeredPlantId } = req.body;
// //     const tradeOfferId = await tradeModel.createTradeOffer({
// //       requestedPlantId,
// //       userId,
// //       offeredPlantId,
// //     });
// //     res
// //       .status(201)
// //       .json({ message: "Trade offer created successfully", tradeOfferId });
// //   } catch (error) {
// //     console.error("Error creating trade request:", error);
// //     res.status(500).json({ message: "Error creating trade request" });
// //   }
// // };

// // exports.requestTrade = async (req, res) => {
// //   try {
// //     const { requestedPlantId, userId, offeredPlantId } = req.body;

// //     // Ajoutez des logs pour vérifier les paramètres
// //     console.log("Received request for trade with parameters:", {
// //       requestedPlantId,
// //       userId,
// //       offeredPlantId,
// //     });

// //     if (!requestedPlantId || !userId || !offeredPlantId) {
// //       throw new Error(
// //         "Invalid parameters: requestedPlantId, userId, or offeredPlantId is undefined"
// //       );
// //     }

// //     const tradeOfferId = await tradeModel.createTradeOffer({
// //       requestedPlantId,
// //       userId,
// //       offeredPlantId,
// //     });

// //     res
// //       .status(201)
// //       .json({ message: "Trade offer created successfully", tradeOfferId });
// //   } catch (error) {
// //     console.error("Error creating trade request:", error);
// //     res.status(500).json({ message: "Error creating trade request" });
// //   }
// // };

// exports.requestTrade = async (req, res) => {
//   try {
//     const { requestedPlantId, userId, offeredPlantId } = req.body;
//     const tradeOfferId = await tradeModel.createTradeOffer({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });
//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade request:", error);
//     res.status(500).json({ message: "Error creating trade request" });
//   }
// };

// exports.createTradeOffer = async (req, res) => {
//   try {
//     const { requestedPlantId, userId, offeredPlantId } = req.body;

//     console.log("Requested Plant ID:", requestedPlantId);
//     console.log("User ID:", userId);
//     console.log("Offered Plant ID:", offeredPlantId);

//     if (!requestedPlantId || !userId || !offeredPlantId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const tradeOfferId = await tradeModel.createTradeOffer({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });

//     // Ajoutez des logs pour vérifier les données
//     console.log("Trade offer created with ID:", tradeOfferId);

//     // Récupérer les informations des plantes et des utilisateurs pour la notification
//     const requestedPlant = await tradeModel.getPlantById(requestedPlantId);
//     const offeredPlant = await tradeModel.getPlantById(offeredPlantId);
//     const requestedPlantOwner = requestedPlant.Id_user;
//     const offeredPlantName = offeredPlant.name_plant;
//     const requestedPlantName = requestedPlant.name_plant;

//     const notif = `L'utilisateur ${userId} vous demande si vous acceptez sa demande de troc : échange de ${offeredPlantName} contre ${requestedPlantName}.`;

//     // Créer une notification pour le propriétaire de la plante demandée
//     await tradeModel.createNotification({
//       userId: requestedPlantOwner,
//       notif,
//       tradeOfferId,
//     });

//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade offer:", error);
//     res.status(500).json({ message: "Error creating trade offer" });
//   }
// };

// exports.getTradeOffersForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const tradeOffers = await tradeModel.getTradeOffersForUser(userId);
//     res.status(200).json(tradeOffers);
//   } catch (error) {
//     console.error("Error fetching trade offers:", error);
//     res.status(500).json({ message: "Error fetching trade offers" });
//   }
// };

// exports.acceptTrade = async (req, res) => {
//   try {
//     const tradeOfferId = req.params.tradeOfferId;
//     await tradeModel.updateTradeOfferStatus(tradeOfferId, "accepted"); // Utilisez tradeModel au lieu de TradeModel
//     res.status(200).json({ message: "Trade accepted successfully" });
//   } catch (error) {
//     console.error("Error accepting trade:", error);
//     res.status(500).json({ message: "Error accepting trade" });
//   }
// };

// exports.rejectTrade = async (req, res) => {
//   try {
//     const tradeOfferId = req.params.tradeOfferId;
//     await tradeModel.updateTradeOfferStatus(tradeOfferId, "rejected"); // Utilisez tradeModel au lieu de TradeModel
//     res.status(200).json({ message: "Trade rejected successfully" });
//   } catch (error) {
//     console.error("Error rejecting trade:", error);
//     res.status(500).json({ message: "Error rejecting trade" });
//   }
// };

// exports.updateTradeOfferStatus = async (req, res) => {
//   const tradeOfferId = req.params.tradeOfferId;
//   const status = req.params.status;

//   if (!tradeOfferId || !status) {
//     return res.status(400).json({ message: "Invalid parameters" });
//   }

//   try {
//     const result = await tradeModel.updateTradeOfferStatus(
//       tradeOfferId,
//       status
//     );
//     return res.json(result);
//   } catch (error) {
//     console.error("Error updating trade offer status:", error);
//     return res.status(500).json({ message: "Database error" });
//   }
// };

// exports.createNotification = async (req, res) => {
//   try {
//     const { userId, message, tradeOfferId } = req.body;
//     const notificationId = await tradeModel.createNotification({
//       userId,
//       message,
//       tradeOfferId,
//     });
//     res
//       .status(201)
//       .json({ message: "Notification created successfully", notificationId });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     res.status(500).json({ message: "Error creating notification" });
//   }
// };

// exports.getNotificationsForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const notifications = await tradeModel.getNotificationsForUser(userId);
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({ message: "Error fetching notifications" });
//   }
// };

// exports.markNotificationAsRead = async (req, res) => {
//   try {
//     const { notificationId } = req.params;
//     const affectedRows = await tradeModel.markNotificationAsRead(
//       notificationId
//     );
//     if (affectedRows > 0) {
//       res
//         .status(200)
//         .json({ message: "Notification marked as read successfully" });
//     } else {
//       res.status(404).json({ message: "Notification not found" });
//     }
//   } catch (error) {
//     console.error("Error marking notification as read:", error);
//     res.status(500).json({ message: "Error marking notification as read" });
//   }
// };

// exports.getAvailableTrades = async (req, res) => {
//   try {
//     const suggestedPlants = [
//       {
//         id_plante_suggested: 1,
//         quantity_possess: 10,
//         date_possess: "2023-07-01",
//         photo: "url_to_photo",
//         state_exchange: "available",
//         id_user: 2,
//         id_plant: 3,
//         name_plant: "Rose",
//       },
//     ];
//     res.status(200).json(suggestedPlants);
//   } catch (error) {
//     console.error("Error fetching available trades:", error);
//     res.status(500).json({ message: "Error fetching available trades" });
//   }
// };

const tradeModel = require("../models/tradeModel");
const notificationModel = require("../models/notificationModel");

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

// exports.requestTrade = async (req, res) => {
//   const { requestedPlantId, userId, offeredPlantId } = req.body;

//   if (!requestedPlantId || !userId || !offeredPlantId) {
//     return res.status(400).json({ message: "Invalid parameters" });
//   }

//   try {
//     const tradeOfferId = await tradeModel.requestTrade({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });

//     // Create a notification for the requested user
//     await notificationModel.createNotification({
//       userId, // Assurez-vous que c'est l'ID de l'utilisateur qui doit recevoir la notification
//       message: `Vous avez une nouvelle demande de troc.`,
//       tradeOfferId,
//     });

//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade request:", error);
//     res.status(500).json({ message: "Error creating trade request" });
//   }
// };

exports.requestTrade = async (req, res) => {
  try {
    const { requestedPlantId, userId, offeredPlantId } = req.body;

    console.log("Requested Plant ID:", requestedPlantId);
    console.log("User ID:", userId);
    console.log("Offered Plant ID:", offeredPlantId);

    if (!requestedPlantId || !userId || !offeredPlantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tradeOfferId = await tradeModel.requestTrade({
      requestedPlantId,
      userId,
      offeredPlantId,
    });

    console.log("Trade offer created with ID:", tradeOfferId);

    // Récupérer les informations des plantes et des utilisateurs pour la notification
    const requestedPlant = await tradeModel.getPlantById(requestedPlantId);
    const offeredPlant = await tradeModel.getPlantById(offeredPlantId);
    const requestedPlantOwner = requestedPlant.Id_user;
    const offeredPlantName = offeredPlant.name_plant;
    const requestedPlantName = requestedPlant.name_plant;

    // Récupérer le nom d'utilisateur de l'utilisateur qui fait la demande
    const user = await tradeModel.getUserById(userId);
    const username = user.username;

    const message = `L'utilisateur ${username} vous demande si vous acceptez sa demande de troc : échange de ${offeredPlantName} contre ${requestedPlantName}.`;

    console.log("Creating notification with:", {
      userId: requestedPlantOwner,
      message,
      tradeOfferId,
    });

    // Créer une notification pour le propriétaire de la plante demandée
    await notificationModel.createNotification({
      userId: requestedPlantOwner,
      message,
      tradeOfferId,
    });

    res
      .status(201)
      .json({ message: "Trade offer created successfully", tradeOfferId });
  } catch (error) {
    console.error("Error creating trade offer:", error);
    res.status(500).json({ message: "Error creating trade offer" });
  }
};

// exports.requestTrade = async (req, res) => {
//   const { requestedPlantId, userId, offeredPlantId } = req.body;
//   console.log("Controller received request with:", {
//     requestedPlantId,
//     userId,
//     offeredPlantId,
//   });

//   if (!requestedPlantId || !userId || !offeredPlantId) {
//     console.error("Invalid trade data:", {
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });
//     return res.status(400).json({ message: "Invalid parameters" });
//   }

//   try {
//     const tradeOfferId = await tradeModel.requestTrade({
//       requestedPlantId,
//       userId,
//       offeredPlantId,
//     });
//     console.log("Trade offer created with ID:", tradeOfferId);

//     res
//       .status(201)
//       .json({ message: "Trade offer created successfully", tradeOfferId });
//   } catch (error) {
//     console.error("Error creating trade request:", error);
//     res.status(500).json({ message: "Error creating trade request" });
//   }
// };

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

exports.acceptTrade = async (req, res) => {
  try {
    const tradeOfferId = req.params.tradeOfferId;

    // Met à jour le statut de la demande de troc à "acceptée"
    await tradeModel.updateTradeOfferStatus(tradeOfferId, "accepted");

    // Récupérer les informations supplémentaires
    const tradeOffer = await tradeModel.getTradeOfferById(tradeOfferId);
    const accepterUser = await tradeModel.getUserById(
      tradeOffer.offered_by_user_id
    );
    const offeredPlant = await tradeModel.getPlantById(
      tradeOffer.offeredPlantId
    );

    const response = {
      message: "Trade accepted successfully",
      tradeOfferId: tradeOfferId,
      accepterUsername: accepterUser.username,
      offeredPlantName: offeredPlant.name_plant,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error accepting trade:", error);
    res.status(500).json({ message: "Error accepting trade" });
  }
};

exports.rejectTrade = async (req, res) => {
  try {
    const tradeOfferId = req.params.tradeOfferId;
    await tradeModel.updateTradeOfferStatus(tradeOfferId, "rejected");
    res.status(200).json({ message: "Trade rejected successfully" });
  } catch (error) {
    console.error("Error rejecting trade:", error);
    res.status(500).json({ message: "Error rejecting trade" });
  }
};

exports.updateTradeOfferStatus = async (req, res) => {
  const tradeOfferId = req.params.tradeOfferId;
  const status = req.params.status;

  if (!tradeOfferId || !status) {
    return res.status(400).json({ message: "Invalid parameters" });
  }

  try {
    const result = await tradeModel.updateTradeOfferStatus(
      tradeOfferId,
      status
    );
    return res.json(result);
  } catch (error) {
    console.error("Error updating trade offer status:", error);
    return res.status(500).json({ message: "Database error" });
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
    ];
    res.status(200).json(suggestedPlants);
  } catch (error) {
    console.error("Error fetching available trades:", error);
    res.status(500).json({ message: "Error fetching available trades" });
  }
};
