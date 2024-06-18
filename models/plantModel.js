const db = require("../config/db");

async function getPlantNamesFromDB() {
  const query = "SELECT id_plant AS id, name_plant AS name FROM generic_plants";
  const [results] = await db.execute(query);
  return results.map((row) => ({
    id: row.id,
    name: row.name,
  }));
}

async function addPlantSuggestionToDB({
  plantName,
  stateExchange,
  photo,
  userId,
}) {
  const query = `INSERT INTO plante_suggested 
    (id_plant, state_exchange, photo, id_user) 
    VALUES 
    ((SELECT id_plant FROM generic_plants WHERE name_plant = ?), ?, ?, ?)`;
  const values = [plantName, stateExchange, photo, userId];
  try {
    await db.execute(query, values);
    return true;
  } catch (error) {
    console.error("Error adding plant suggestion:", error);
    return false;
  }
}

module.exports = {
  getPlantNamesFromDB,
  addPlantSuggestionToDB,
};
