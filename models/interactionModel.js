const db = require("../config/db");

exports.addInteraction = async (
  user_id,
  plant_id,
  id_interaction_type,
  created_at
) => {
  const query = `
    INSERT INTO user_plant_interactions (user_id, Id_plant, id_interaction_type, created_at)
    VALUES (?, ?, ?, ?)
  `;
  try {
    await db.execute(query, [
      user_id,
      plant_id,
      id_interaction_type,
      created_at,
    ]);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'interaction :", error);
    throw new Error("Database error");
  }
};

exports.getInteractionsForUser = async (userId) => {
  const query = `
    SELECT i.*, p.name_plant, it.label_interaction_type
    FROM user_plant_interactions i
    JOIN plante_suggested ps ON i.Id_plant = ps.Id_plant
    JOIN generic_plants p ON ps.Id_plant = p.Id_plant
    JOIN interaction_type it ON i.id_interaction_type = it.id_interaction_type
    WHERE i.user_id = ?
    ORDER BY i.created_at DESC
  `;
  try {
    const [results] = await db.execute(query, [userId]);
    return results;
  } catch (error) {
    console.error("Erreur lors de la récupération des interactions :", error);
    throw new Error("Database error");
  }
};

exports.getInteractionTypes = async () => {
  const query = `
    SELECT * FROM interaction_type
  `;
  try {
    const [results] = await db.execute(query);
    return results;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des types d'interaction :",
      error
    );
    throw new Error("Database error");
  }
};
