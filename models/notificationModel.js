const db = require("../config/db");

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
  const query = `
    SELECT n.*, 
           gp1.name_plant as offered_plant_name, 
           gp2.name_plant as requested_plant_name, 
           u2.username as receiver_name
    FROM notifications n
    LEFT JOIN request t ON n.trade_offer_id = t.Id_request
    LEFT JOIN plante_suggested ps1 ON t.Id_plante_suggested = ps1.Id_plante_suggested
    LEFT JOIN plante_suggested ps2 ON t.Id_plante_suggested_1 = ps2.Id_plante_suggested
    LEFT JOIN generic_plants gp1 ON ps1.Id_plant = gp1.Id_plant
    LEFT JOIN generic_plants gp2 ON ps2.Id_plant = gp2.Id_plant
    LEFT JOIN users u2 ON t.Id_user = u2.Id_user
    WHERE n.user_id = ? AND n.read_status = 'unread'
  `;
  try {
    const [results] = await db.execute(query, [userId]);
    return results;
  } catch (error) {
    console.error("Error fetching notifications from DB:", error);
    throw new Error("Database error");
  }
}

async function updateNotificationStatus(notificationId, status) {
  const query = `
    UPDATE notifications
    SET read_status = ?
    WHERE id_notification = ?
  `;
  try {
    const [result] = await db.execute(query, [status, notificationId]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw new Error("Database error");
  }
}
async function markNotificationAsRead(notificationId) {
  const query = `
    UPDATE notifications
    SET read_status = 'read'
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
  updateNotificationStatus,
  markNotificationAsRead,
};
