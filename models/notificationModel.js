// models/notificationsModel.js

const db = require("../config/db");

// async function createNotification({
//   userId,
//   message,
//   tradeOfferId,
//   readStatus = false,
// }) {
//   const query = `
//     INSERT INTO notifications (user_id, message, trade_offer_id, read_status)
//     VALUES (?, ?, ?, ?)
//   `;
//   try {
//     const [result] = await db.execute(query, [
//       userId,
//       message,
//       tradeOfferId,
//       readStatus,
//     ]);
//     return result.insertId;
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     throw new Error("Database error");
//   }
// }

// async function sendNotification({ userId, message, tradeOfferId }) {
//   const insertNotificationQuery = `
//     INSERT INTO notifications (user_id, message, trade_offer_id, read_status)
//     VALUES (?, ?, ?, 'unread')
//   `;

//   try {
//     const [result] = await db.execute(insertNotificationQuery, [
//       userId,
//       message,
//       tradeOfferId,
//     ]);

//     return result.insertId;
//   } catch (error) {
//     console.error("Error creating notification:", error);
//     throw new Error("Database error");
//   }
// }
async function createNotification({ userId, message, tradeOfferId }) {
  const insertNotificationQuery = `
    INSERT INTO notifications (user_id, message, trade_offer_id, read_status)
    VALUES (?, ?, ?, 'unread')
  `;
  console.log("Creating notification with data:", {
    userId,
    message,
    tradeOfferId,
  });

  if (
    userId === undefined ||
    message === undefined ||
    tradeOfferId === undefined
  ) {
    console.error("One of the notification parameters is undefined:", {
      userId,
      message,
      tradeOfferId,
    });
    throw new Error("One of the notification parameters is undefined");
  }
  try {
    const [result] = await db.execute(insertNotificationQuery, [
      userId,
      message,
      tradeOfferId,
    ]);

    return result.insertId;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Database error");
  }
}

async function getNotificationsForUser(userId) {
  const query = `SELECT * FROM notifications WHERE user_id = ?`;
  try {
    const [results] = await db.execute(query, [userId]);
    return results;
  } catch (error) {
    console.error("Error fetching notifications from DB:", error);
    throw new Error("Database error");
  }
}

async function markNotificationAsRead(notificationId) {
  const query = `
    UPDATE notifications
    SET read_status = true
    WHERE id_notification = ?
  `;
  try {
    const [result] = await db.execute(query, [notificationId]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Database error");
  }
}

module.exports = {
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
};
