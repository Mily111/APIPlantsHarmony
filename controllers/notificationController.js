const notificationModel = require("../models/notificationModel");

// exports.createNotification = async (req, res) => {
//   try {
//     const { userId, message, tradeOfferId } = req.body;
//     const notificationId = await notificationModel.createNotification({
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

// exports.createNotification = async (req, res) => {
//   const { userId, message, tradeOfferId } = req.body;

//   if (!userId || !message) {
//     return res.status(400).json({ message: "Invalid parameters" });
//   }

//   try {
//     const notificationId = await notificationModel.sendNotification({
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

// exports.sendNotification = async (req, res) => {
//   const { userId, message, tradeOfferId } = req.body;
//   console.log("Controller received request to send notification with:", {
//     userId,
//     message,
//     tradeOfferId,
//   });

//   if (!userId || !message) {
//     console.error("Invalid notification data:", {
//       userId,
//       message,
//       tradeOfferId,
//     });
//     return res.status(400).json({ message: "Invalid parameters" });
//   }

//   try {
//     const notificationId = await notificationModel.sendNotification({
//       userId,
//       message,
//       tradeOfferId,
//     });
//     console.log("Notification created with ID:", notificationId);

//     res
//       .status(201)
//       .json({ message: "Notification created successfully", notificationId });
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     res.status(500).json({ message: "Error creating notification" });
//   }
// };
