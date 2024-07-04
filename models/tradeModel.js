const db = require("../config/db");

async function getAvailablePlantsForTrade() {
  const query = `
    SELECT ps.*, gp.name_plant, u.username
    FROM plante_suggested ps
    JOIN generic_plants gp ON ps.id_plant = gp.id_plant
    JOIN users u ON ps.id_user = u.id_user
    WHERE ps.state_exchange = 'disponible'
  `;
  try {
    const [plants] = await db.execute(query);
    return plants;
  } catch (error) {
    console.error("Error fetching available plants for trade from DB:", error);
    throw new Error("Database error");
  }
}

async function createTradeOffer({ requestedPlantId, userId, offeredPlantId }) {
  const insertTradeQuery = `
    INSERT INTO request (Id_plante_suggested, Id_user, Id_plante_suggested_1, date_request)
    VALUES (?, ?, ?, NOW())
  `;
  const getRequestedPlantQuery = `
    SELECT name_plant, Id_user 
    FROM plante_suggested 
    INNER JOIN generic_plants ON plante_suggested.Id_plant = generic_plants.Id_plant 
    WHERE Id_plante_suggested = ?
  `;
  const getOfferedPlantQuery = `
    SELECT name_plant 
    FROM plante_suggested 
    INNER JOIN generic_plants ON plante_suggested.Id_plant = generic_plants.Id_plant 
    WHERE Id_plante_suggested = ?
  `;
  const getUserQuery = `
    SELECT username 
    FROM users 
    WHERE Id_user = ?
  `;
  const insertNotificationQuery = `
    INSERT INTO notifications (user_id, message, trade_offer_id, read_status) 
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await db.execute(insertTradeQuery, [
      requestedPlantId,
      userId,
      offeredPlantId,
    ]);
    const tradeOfferId = result.insertId;

    const [requestedPlant] = await db.execute(getRequestedPlantQuery, [
      requestedPlantId,
    ]);
    const [offeredPlant] = await db.execute(getOfferedPlantQuery, [
      offeredPlantId,
    ]);
    const [user] = await db.execute(getUserQuery, [userId]);

    const notificationMessage = `L'utilisateur ${user[0].username} vous demande si vous acceptez sa demande de troc : échange de ${offeredPlant[0].name_plant} contre ${requestedPlant[0].name_plant}.`;

    await db.execute(insertNotificationQuery, [
      requestedPlant[0].Id_user,
      notificationMessage,
      tradeOfferId,
      0,
    ]);

    return tradeOfferId;
  } catch (error) {
    console.error("Error creating trade offer:", error);
    throw new Error("Database error");
  }
}

async function getAvailablePlantsForUser(userId) {
  const query = `
    SELECT ps.id_plante_suggested, gp.name_plant
    FROM plante_suggested ps
    JOIN generic_plants gp ON ps.id_plant = gp.id_plant
    WHERE ps.id_user = ? AND ps.state_exchange = 'disponible'
  `;
  try {
    const [plants] = await db.execute(query, [userId]);
    return plants;
  } catch (error) {
    console.error("Error fetching available plants for user from DB:", error);
    throw new Error("Database error");
  }
}

async function getPlantOwner(plantId) {
  const query = `
    SELECT id_user FROM plante_suggested WHERE id_plante_suggested = ?
  `;
  try {
    const [results] = await db.execute(query, [plantId]);
    return results[0].id_user;
  } catch (error) {
    console.error("Error fetching plant owner:", error);
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

async function getPlantById(plantId) {
  const query = `
    SELECT ps.*, gp.name_plant, u.username
    FROM plante_suggested ps
    JOIN generic_plants gp ON ps.Id_plant = gp.Id_plant
    JOIN users u ON ps.Id_user = u.Id_user
    WHERE ps.Id_plante_suggested = ?
  `;
  try {
    const [result] = await db.execute(query, [plantId]);
    return result[0];
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    throw new Error("Database error");
  }
}

module.exports = {
  getAvailablePlantsForTrade,
  getPlantOwner,
  createTradeOffer,
  getAvailablePlantsForUser,
  getTradeOffersForUser,
  updateTradeOfferStatus,
  createNotification,
  getNotificationsForUser,
  markNotificationAsRead,
  getPlantById,
};
