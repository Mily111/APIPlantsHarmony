const db = require("../config/db");

async function getPlantNamesFromDB() {
  const query = "SELECT id_plant AS id, name_plant AS name FROM generic_plants";
  try {
    const [results] = await db.execute(query);
    return results.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  } catch (error) {
    console.error("Error fetching plant names from DB:", error);
    throw new Error("Database error");
  }
}

async function addOrUpdatePlantSuggestion({
  plantName,
  stateExchange,
  photo,
  userId,
}) {
  const datePossess = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    // Obtenez l'id_plant correspondant au plantName
    const getPlantIdQuery = `SELECT id_plant FROM generic_plants WHERE name_plant = ? LIMIT 1`;
    const [plantResult] = await db.execute(getPlantIdQuery, [plantName]);

    if (plantResult.length === 0) {
      throw new Error("Plant not found");
    }

    const idPlant = plantResult[0].id_plant;

    // Insérez ou mettez à jour la ligne pour l'ajout de la plante
    const insertQuery = `
      INSERT INTO plante_suggested
      (id_plant, state_exchange, photo, id_user, quantity_possess, date_possess, total_quantity_plante_suggested)
      VALUES
      (?, ?, ?, ?, 1, ?, 0)
      ON DUPLICATE KEY UPDATE
      quantity_possess = quantity_possess + 1,
      date_possess = VALUES(date_possess),
      photo = VALUES(photo),
      state_exchange = VALUES(state_exchange)`;
    const insertValues = [idPlant, stateExchange, photo, userId, datePossess];
    const [insertResult] = await db.execute(insertQuery, insertValues);
    console.log("Inserted or updated plant suggestion, result:", insertResult);

    // Recalculez la quantité totale des plantes suggérées pour l'utilisateur
    const totalQuantityQuery = `
      SELECT SUM(quantity_possess) AS total_quantity
      FROM plante_suggested
      WHERE id_user = ?`;
    const [totalQuantityResult] = await db.execute(totalQuantityQuery, [
      userId,
    ]);

    const newTotalQuantity = totalQuantityResult[0].total_quantity;

    // Mettez à jour total_quantity_plante_suggested pour tous les enregistrements de l'utilisateur
    const updateTotalQuantityQuery = `
      UPDATE plante_suggested
      SET total_quantity_plante_suggested = ?
      WHERE id_user = ?`;
    const updateTotalQuantityValues = [newTotalQuantity, userId];
    const [updateTotalQuantityResult] = await db.execute(
      updateTotalQuantityQuery,
      updateTotalQuantityValues
    );
    console.log(
      "Updated total quantity for user, result:",
      updateTotalQuantityResult
    );
  } catch (error) {
    console.error("Error in addOrUpdatePlantSuggestion:", error);
    throw new Error("Database error");
  }
}

module.exports = {
  getPlantNamesFromDB,
  addOrUpdatePlantSuggestion,
};
