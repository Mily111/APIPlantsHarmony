const db = require("../config/db");
const path = require("path"); // Ajoutez cette ligne pour importer le module path
const fs = require("fs"); // Ajoutez cette ligne pour importer le module fs

async function getPlantNamesFromDB() {
  const query = "SELECT id_plant AS id, name_plant AS name FROM generic_plants";
  try {
    const [results] = await db.execute(query);
    // Filtrez les résultats pour enlever les entrées avec des valeurs undefined
    return results
      .filter((row) => row.id && row.name)
      .map((row) => ({
        id_plant: row.id,
        name_plant: row.name,
      }));
  } catch (error) {
    console.error("Error fetching plant names from DB:", error);
    throw new Error("Database error");
  }
}

async function getUserName(userId) {
  const query = "SELECT username FROM users WHERE id_user = ?";
  const [rows] = await db.execute(query, [userId]);
  if (rows.length > 0) {
    return rows[0].username;
  } else {
    throw new Error("User not found");
  }
}

// async function addOrUpdatePlantSuggestion({
//   plantName,
//   stateExchange,
//   photo,
//   userId,
// }) {
//   const datePossess = new Date().toISOString().slice(0, 19).replace("T", " ");

//   try {
//     console.log(`Starting addOrUpdatePlantSuggestion for user ${userId}`);

//     // Obtenez l'id_plant correspondant au plantName
//     const getPlantIdQuery = `SELECT id_plant FROM generic_plants WHERE name_plant = ? LIMIT 1`;
//     const [plantResult] = await db.execute(getPlantIdQuery, [plantName]);
//     console.log("Plant result:", plantResult);

//     if (plantResult.length === 0) {
//       throw new Error("Plant not found");
//     }

//     const idPlant = plantResult[0].id_plant;

//     // Obtenez le nom de l'utilisateur
//     const username = await getUserName(userId);
//     console.log("Username:", username);

//     // Incluez le nom de l'utilisateur dans le nom de fichier
//     let photoPath = null;
//     if (photo) {
//       const extension = path.extname(photo);
//       const formattedPlantName = plantName.replace(/\s+/g, "_").toLowerCase();
//       const formattedUsername = username.replace(/\s+/g, "_").toLowerCase();
//       const photoFileName = `${formattedPlantName}_${formattedUsername}${extension}`;
//       photoPath = path
//         .join("images", "plants", photoFileName)
//         .replace(/\\/g, "/"); // Replace backslashes with slashes

//       // Déplacez et renommez le fichier vers le bon emplacement
//       const currentPath = path.join(
//         __dirname,
//         "../../plants-harmony-web/public",
//         "images",
//         "plants",
//         `${formattedPlantName}${extension}`
//       );
//       const destPath = path.join(
//         __dirname,
//         "../../plants-harmony-web/public",
//         photoPath
//       );
//       console.log(`Moving file from ${currentPath} to ${destPath}`);
//       fs.renameSync(currentPath, destPath);
//     }

//     // Insérez ou mettez à jour la ligne pour l'ajout de la plante
//     const insertQuery = `
//       INSERT INTO plante_suggested
//       (id_plant, state_exchange, photo, id_user, quantity_possess, date_possess, total_quantity_plante_suggested)
//       VALUES
//       (?, ?, ?, ?, 1, ?, 0)
//       ON DUPLICATE KEY UPDATE
//       quantity_possess = quantity_possess + 1,
//       date_possess = VALUES(date_possess),
//       photo = VALUES(photo),
//       state_exchange = VALUES(state_exchange)`;
//     const insertValues = [
//       idPlant,
//       stateExchange,
//       photoPath,
//       userId,
//       datePossess,
//     ];
//     console.log("Insert values:", insertValues);
//     const [insertResult] = await db.execute(insertQuery, insertValues);
//     console.log("Inserted or updated plant suggestion, result:", insertResult);

//     // Recalculez la quantité totale des plantes suggérées pour l'utilisateur
//     const totalQuantityQuery = `
//       SELECT SUM(quantity_possess) AS total_quantity
//       FROM plante_suggested
//       WHERE id_user = ?`;
//     const [totalQuantityResult] = await db.execute(totalQuantityQuery, [
//       userId,
//     ]);
//     console.log("Total quantity result:", totalQuantityResult);

//     const newTotalQuantity = totalQuantityResult[0].total_quantity;

//     // Mettez à jour total_quantity_plante_suggested pour tous les enregistrements de l'utilisateur
//     const updateTotalQuantityQuery = `
//       UPDATE plante_suggested
//       SET total_quantity_plante_suggested = ?
//       WHERE id_user = ?`;
//     const updateTotalQuantityValues = [newTotalQuantity, userId];
//     const [updateTotalQuantityResult] = await db.execute(
//       updateTotalQuantityQuery,
//       updateTotalQuantityValues
//     );
//     console.log(
//       "Updated total quantity for user, result:",
//       updateTotalQuantityResult
//     );
//   } catch (error) {
//     console.error("Error in addOrUpdatePlantSuggestion:", error);
//     throw new Error("Database error");
//   }
// }

// async function addOrUpdatePlantSuggestion({
//   plantName,
//   stateExchange,
//   photo,
//   userId,
// }) {
//   const datePossess = new Date().toISOString().slice(0, 19).replace("T", " ");

//   try {
//     console.log(`Starting addOrUpdatePlantSuggestion for user ${userId}`);

//     // Obtenez l'id_plant correspondant au plantName
//     const getPlantIdQuery = `SELECT id_plant FROM generic_plants WHERE name_plant = ? LIMIT 1`;
//     const [plantResult] = await db.execute(getPlantIdQuery, [plantName]);
//     console.log("Plant result:", plantResult);

//     if (plantResult.length === 0) {
//       throw new Error("Plant not found");
//     }

//     const idPlant = plantResult[0].id_plant;

//     // Obtenez le nom de l'utilisateur
//     const username = await getUserName(userId);
//     console.log("Username:", username);

//     // Incluez le nom de l'utilisateur dans le nom de fichier
//     let photoPath = null;
//     if (photo) {
//       const extension = path.extname(photo);
//       const formattedPlantName = plantName.replace(/\s+/g, "_").toLowerCase();
//       const formattedUsername = username.replace(/\s+/g, "_").toLowerCase();
//       const photoFileName = `${formattedPlantName}_${formattedUsername}${extension}`;
//       photoPath = path
//         .join("images", "plants", photoFileName)
//         .replace(/\\/g, "/"); // Replace backslashes with slashes

//       // Déplacez et renommez le fichier vers le bon emplacement
//       const currentPath = path.join(
//         __dirname,
//         "../../plants-harmony-web/public",
//         "images",
//         "plants",
//         `${formattedPlantName}${extension}`
//       );
//       const destPath = path.join(
//         __dirname,
//         "../../plants-harmony-web/public",
//         photoPath
//       );
//       console.log(`Moving file from ${currentPath} to ${destPath}`);

//       // Ajoutez une vérification pour voir si le fichier existe
//       if (!fs.existsSync(currentPath)) {
//         throw new Error(`File ${currentPath} does not exist`);
//       }

//       fs.renameSync(currentPath, destPath);
//     }

//     // Insérez ou mettez à jour la ligne pour l'ajout de la plante
//     const insertQuery = `
//       INSERT INTO plante_suggested
//       (id_plant, state_exchange, photo, id_user, quantity_possess, date_possess, total_quantity_plante_suggested)
//       VALUES
//       (?, ?, ?, ?, 1, ?, 0)
//       ON DUPLICATE KEY UPDATE
//       quantity_possess = quantity_possess + 1,
//       date_possess = VALUES(date_possess),
//       photo = VALUES(photo),
//       state_exchange = VALUES(state_exchange)`;
//     const insertValues = [
//       idPlant,
//       stateExchange,
//       photoPath,
//       userId,
//       datePossess,
//     ];
//     console.log("Insert values:", insertValues);
//     const [insertResult] = await db.execute(insertQuery, insertValues);
//     console.log("Inserted or updated plant suggestion, result:", insertResult);

//     // Recalculez la quantité totale des plantes suggérées pour l'utilisateur
//     const totalQuantityQuery = `
//       SELECT SUM(quantity_possess) AS total_quantity
//       FROM plante_suggested
//       WHERE id_user = ?`;
//     const [totalQuantityResult] = await db.execute(totalQuantityQuery, [
//       userId,
//     ]);
//     console.log("Total quantity result:", totalQuantityResult);

//     const newTotalQuantity = totalQuantityResult[0].total_quantity;

//     // Mettez à jour total_quantity_plante_suggested pour tous les enregistrements de l'utilisateur
//     const updateTotalQuantityQuery = `
//       UPDATE plante_suggested
//       SET total_quantity_plante_suggested = ?
//       WHERE id_user = ?`;
//     const updateTotalQuantityValues = [newTotalQuantity, userId];
//     const [updateTotalQuantityResult] = await db.execute(
//       updateTotalQuantityQuery,
//       updateTotalQuantityValues
//     );
//     console.log(
//       "Updated total quantity for user, result:",
//       updateTotalQuantityResult
//     );
//   } catch (error) {
//     console.error("Error in addOrUpdatePlantSuggestion:", error);
//     throw new Error("Database error");
//   }
// }

async function addOrUpdatePlantSuggestion({
  plantName,
  stateExchange,
  photo,
  userId,
}) {
  const datePossess = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    console.log(`Starting addOrUpdatePlantSuggestion for user ${userId}`);

    // Obtenez l'id_plant correspondant au plantName
    const getPlantIdQuery = `SELECT id_plant FROM generic_plants WHERE name_plant = ? LIMIT 1`;
    const [plantResult] = await db.execute(getPlantIdQuery, [plantName]);
    console.log("Plant result:", plantResult);

    if (plantResult.length === 0) {
      throw new Error("Plant not found");
    }

    const idPlant = plantResult[0].id_plant;

    // Obtenez le nom de l'utilisateur
    const username = await getUserName(userId);
    console.log("Username:", username);

    // Incluez le nom de l'utilisateur dans le nom de fichier
    let photoPath = null;
    if (photo) {
      const extension = path.extname(photo);
      const formattedPlantName = plantName
        .replace(/\s+/g, "_")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
      const formattedUsername = username
        .replace(/\s+/g, "_")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");
      const photoFileName = `${formattedPlantName}_${formattedUsername}${extension}`;
      photoPath = path
        .join("images", "plants", photoFileName)
        .replace(/\\/g, "/"); // Replace backslashes with slashes

      // Déplacez et renommez le fichier vers le bon emplacement
      const tempPath = path.join(
        __dirname,
        "../../plants_harmony_web/public",
        "images",
        "plants",
        path.basename(photo)
      );
      const destPath = path.join(
        __dirname,
        "../../plants_harmony_web/public",
        photoPath
      );
      console.log(`Moving file from ${tempPath} to ${destPath}`);

      // Ajoutez une vérification pour voir si le fichier existe
      if (!fs.existsSync(tempPath)) {
        throw new Error(`File ${tempPath} does not exist`);
      }

      fs.renameSync(tempPath, destPath);
    }

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
    const insertValues = [
      idPlant,
      stateExchange,
      photoPath,
      userId,
      datePossess,
    ];
    console.log("Insert values:", insertValues);
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
    console.log("Total quantity result:", totalQuantityResult);

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

async function getUserPlants(userId) {
  const query = "SELECT * FROM plante_suggested WHERE id_user = ?";
  try {
    const [plants] = await db.query(query, [userId]);
    return plants;
  } catch (error) {
    console.error("Error fetching user's plants:", error);
    throw new Error("Database error");
  }
}

async function getAvailablePlants() {
  const query = `
    SELECT ps.*, gp.name_plant, u.username
    FROM plante_suggested ps
    JOIN generic_plants gp ON ps.id_plant = gp.id_plant
    JOIN users u ON ps.id_user = u.id_user
    WHERE ps.state_exchange = 'disponible'`;
  try {
    const [plants] = await db.execute(query);
    return plants;
  } catch (error) {
    console.error("Error fetching available plants from DB:", error);
    throw new Error("Database error");
  }
}

async function deleteUserPlantByID(plantId) {
  const query = "DELETE FROM plante_suggested WHERE id_plante_suggested = ?";
  try {
    const [result] = await db.execute(query, [plantId]);
    console.log(`Deleted ${result.affectedRows} rows`); // Log le nombre de lignes supprimées
    return result;
  } catch (error) {
    console.error("Error deleting user plant from DB:", error);
    throw new Error("Database error");
  }
}

async function updatePlantState(plantId, stateExchange) {
  const query =
    "UPDATE plante_suggested SET state_exchange = ? WHERE id_plante_suggested = ?";
  try {
    const [result] = await db.execute(query, [stateExchange, plantId]);
    return result;
  } catch (error) {
    console.error("Error updating plant state:", error);
    throw new Error("Database error");
  }
}

async function requestTrade({ requestedPlantId, userId, offeredPlantId }) {
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

module.exports = {
  getPlantNamesFromDB,
  addOrUpdatePlantSuggestion,
  getUserPlants,
  getUserName,
  getAvailablePlants,
  deleteUserPlantByID,
  updatePlantState,
  requestTrade,
};
