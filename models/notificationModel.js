// models/tradeModel.js

const db = require("../config/db");

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
  const query = `UPDATE notifications SET read_status = true WHERE id = ?`;
  try {
    const [result] = await db.execute(query, [notificationId]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error marking notification as read in DB:", error);
    throw new Error("Database error");
  }
}

module.exports = {
  getNotificationsForUser,
  markNotificationAsRead,
};
