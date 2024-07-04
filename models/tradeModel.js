const db = require("../config/db");

async function createTradeOffer({
  requestedPlantId,
  userId,
  offeredPlantId,
  status = "pending",
}) {
  const query = `
    INSERT INTO request (Id_plante_suggested, Id_user, Id_plante_suggested_1, date_request, status)
    VALUES (?, ?, ?, NOW(), ?)
  `;
  try {
    const [result] = await db.execute(query, [
      requestedPlantId,
      userId,
      offeredPlantId,
      status,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error creating trade offer:", error);
    throw new Error("Database error");
  }
}

async function getTradeOffersForUser(userId) {
  const query = `
    SELECT r.*, ps1.photo AS offered_photo, ps2.photo AS requested_photo, gp1.name_plant AS offered_name, gp2.name_plant AS requested_name
    FROM request r
    JOIN plante_suggested ps1 ON r.Id_plante_suggested_1 = ps1.Id_plante_suggested
    JOIN plante_suggested ps2 ON r.Id_plante_suggested = ps2.Id_plante_suggested
    JOIN generic_plants gp1 ON ps1.Id_plant = gp1.Id_plant
    JOIN generic_plants gp2 ON ps2.Id_plant = gp2.Id_plant
    WHERE r.Id_user = ? OR ps2.Id_user = ?
  `;
  try {
    const [results] = await db.execute(query, [userId, userId]);
    return results;
  } catch (error) {
    console.error("Error fetching trade offers:", error);
    throw new Error("Database error");
  }
}

async function updateTradeOfferStatus(tradeOfferId, status) {
  const query = `
    UPDATE request
    SET status = ?
    WHERE Id_request = ?
  `;
  try {
    const [result] = await db.execute(query, [status, tradeOfferId]);
    return result.affectedRows;
  } catch (error) {
    console.error("Error updating trade offer status:", error);
    throw new Error("Database error");
  }
}

async function createNotification({
  userId,
  message,
  tradeOfferId,
  readStatus = false,
}) {
  const query = `
    INSERT INTO notifications (user_id, message, trade_offer_id, read_status)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [result] = await db.execute(query, [
      userId,
      message,
      tradeOfferId,
      readStatus,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Database error");
  }
}

async function getNotificationsForUser(userId) {
  const query = `
    SELECT * FROM notifications
    WHERE user_id = ?
  `;
  try {
    const [results] = await db.execute(query, [userId]);
    return results;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Database error");
  }
}

async function markNotificationAsRead(notificationId) {
  const query = `
    UPDATE notifications
    SET read_status = true
    WHERE id = ?
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
  createTradeOffer,
  getTradeOffersForUser,
  updateTradeOfferStatus,
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
};
