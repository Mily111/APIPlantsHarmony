const db = require("../config/db");
const fs = require("fs");
const path = require("path");

async function create(userData) {
  const query =
    "INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(query, [
      userData.username,
      userData.email_user,
      userData.password_user,
    ]);
    return result;
  } catch (err) {
    throw new Error("Database error: " + err.message);
  }
}

async function findByUsername(username) {
  const query = "SELECT * FROM users WHERE username = ?";
  try {
    const [rows] = await db.query(query, [username]);
    return rows;
  } catch (err) {
    throw new Error("Database error: " + err.message);
  }
}

async function isAdmin(userId) {
  const query = "SELECT id_type_user_rights FROM users WHERE Id_user = ?";
  try {
    const [rows] = await db.query(query, [userId]);
    if (rows.length > 0 && rows[0].id_type_user_rights === 1) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error("Database error: " + err.message);
  }
}

async function deleteUserById(userId) {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [plants] = await connection.query(
      "SELECT photo FROM plante_suggested WHERE Id_user = ?",
      [userId]
    );
    await connection.query("DELETE FROM plante_suggested WHERE Id_user = ?", [
      userId,
    ]);
    await connection.query(
      "DELETE FROM user_plant_interactions WHERE user_id = ?",
      [userId]
    );
    await connection.query("DELETE FROM request WHERE Id_user = ?", [userId]);
    await connection.query("DELETE FROM notifications WHERE user_id = ?", [
      userId,
    ]);
    const [result] = await connection.query(
      "DELETE FROM users WHERE Id_user = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return false;
    }

    plants.forEach((plant) => {
      if (plant.photo) {
        const filePath = path.resolve(
          __dirname,
          "../../plants-harmony-web/public/",
          plant.photo
        );
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Erreur lors de la suppression de l'image:", err);
            } else {
              console.log("Successfully deleted:", filePath);
            }
          });
        } else {
          console.warn("File does not exist:", filePath);
        }
      }
    });

    await connection.commit();
    connection.release();
    return true;
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw new Error("Database error: " + err.message);
  }
}

// async function findById(userId) {
//   const query = "SELECT * FROM users WHERE id_user = ?";
//   try {
//     const [rows] = await db.query(query, [userId]);
//     if (rows.length === 0) {
//       return null;
//     }
//     return rows[0]; // Retourner l'utilisateur trouvé
//   } catch (err) {
//     throw new Error("Database error: " + err.message);
//   }
// }

async function findById(userId) {
  const query = "SELECT * FROM users WHERE id_user = ?";
  try {
    const [rows] = await db.query(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    throw new Error("Database error: " + err.message);
  }
}

async function getUserStatistics() {
  const query = `
    SELECT u.username, 
           COUNT(DISTINCT ps.Id_plante_suggested) AS plant_count,
           COUNT(DISTINCT upi.id_user_plant_interactions) AS interaction_count
    FROM users u
    LEFT JOIN plante_suggested ps ON u.id_user = ps.id_user
    LEFT JOIN user_plant_interactions upi ON u.id_user = upi.user_id
    GROUP BY u.username
  `;
  try {
    const [results] = await db.execute(query);
    return results;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

async function getUserPlantCounts() {
  const query = `
    SELECT u.username,
           COUNT(ps.id_plante_suggested) AS plant_count
    FROM users u
    LEFT JOIN plante_suggested ps ON u.id_user = ps.id_user
    GROUP BY u.username
  `;
  try {
    const [results] = await db.execute(query);
    return results;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

async function getUserTradeRequests() {
  const query = `
    SELECT u.username,
           COUNT(r.id_request) AS trade_request_count
    FROM users u
    LEFT JOIN request r ON u.id_user = r.id_user
    GROUP BY u.username
  `;
  try {
    const [results] = await db.execute(query);
    return results;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}
async function updateUser(userId, fieldsToUpdate) {
  const query = "UPDATE users SET ? WHERE id_user = ?";
  const values = [fieldsToUpdate, userId];
  try {
    const [result] = await db.query(query, values);
    return result;
  } catch (err) {
    throw new Error("Database error: " + err.message);
  }
}

async function getProfile(userId) {
  const query = "SELECT * FROM users WHERE id_user = ?";
  try {
    const [rows] = await db.query(query, [userId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0]; // Retourner l'utilisateur trouvé
  } catch (err) {
    throw new Error("Database error: " + err.message);
  }
}

module.exports = {
  create,
  findByUsername,
  isAdmin,
  deleteUserById,
  findById,
  getUserStatistics,
  getUserPlantCounts,
  getUserTradeRequests,
  updateUser,
  getProfile,
};
