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

async function requestTrade({ requestedPlantId, userId, offeredPlantId }) {
  const insertTradeQuery = `
    INSERT INTO request (Id_plante_suggested, Id_user, Id_plante_suggested_1, date_request)
    VALUES (?, ?, ?, NOW())
  `;
  console.log("Model received trade request data:", {
    requestedPlantId,
    userId,
    offeredPlantId,
  });

  try {
    const [result] = await db.execute(insertTradeQuery, [
      requestedPlantId,
      userId,
      offeredPlantId,
    ]);

    const tradeRequestId = result.insertId;
    return tradeRequestId;
  } catch (error) {
    console.error("Error creating trade request:", error);
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
async function getUserById(userId) {
  const query = `
    SELECT username FROM users WHERE id_user = ?
  `;
  try {
    const [results] = await db.execute(query, [userId]);
    return results[0];
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Database error");
  }
}

const getTradeOfferById = async (tradeOfferId) => {
  const query = `
    SELECT r.*, u.username as receiver_name, p1.name_plant as offered_plant_name, p2.name_plant as requested_plant_name
    FROM request r
    JOIN users u ON r.Id_user = u.Id_user
    JOIN plante_suggested ps1 ON r.Id_plante_suggested = ps1.Id_plante_suggested
    JOIN plante_suggested ps2 ON r.Id_plante_suggested_1 = ps2.Id_plante_suggested
    JOIN generic_plants p1 ON ps1.id_plant = p1.Id_plant
    JOIN generic_plants p2 ON ps2.id_plant = p2.Id_plant
    WHERE r.Id_request = ?`;

  try {
    const [rows] = await db.execute(query, [tradeOfferId]);
    return rows[0];
  } catch (error) {
    console.error("Error fetching trade offer:", error);
    throw error;
  }
};

module.exports = {
  getAvailablePlantsForTrade,
  requestTrade,
  getAvailablePlantsForUser,
  getTradeOffersForUser,
  updateTradeOfferStatus,
  getPlantOwner,
  getPlantById,
  getUserById,
  getTradeOfferById,
};
