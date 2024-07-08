const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
exports.registerUser = async (req, res) => {
  const { username, email_user, password_user } = req.body;

  console.log("Received request:", req.body); // Log les données reçues

  // Validation des champs requis
  if (!username || !email_user || !password_user) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validation de l'email
  if (!isValidEmail(email_user)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Vérifier l'existence du nom d'utilisateur ou de l'email
  try {
    const checkUser = `SELECT * FROM users WHERE username = ? OR email_user = ?`;
    const [userExists] = await db.execute(checkUser, [username, email_user]);

    if (userExists.length > 0) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
  } catch (checkError) {
    console.error("Database query error: ", checkError.message);
    return res.status(500).json({
      message: "Internal server error",
      error: checkError.message,
    });
  }

  // Essayer de créer l'utilisateur
  try {
    const hashedPassword = await bcrypt.hash(password_user, 10);
    const query = `INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)`;
    const [results] = await db.execute(query, [
      username,
      email_user,
      hashedPassword,
    ]);

    res.status(201).json({
      message: "User registered successfully",
      userId: results.insertId,
    });
  } catch (insertError) {
    console.error("User insertion error: ", insertError.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: insertError.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password_user } = req.body;

  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const [users] = await db.execute(query, [username]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (!user.password_user) {
      return res.status(403).json({ message: "Password not set for user" });
    }

    bcrypt.compare(password_user, user.password_user, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result) {
        const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          status: "ok",
          message: "User logged in successfully",
          token: token,
          userId: user.Id_user, // Ajoutez userId à la réponse
        });
      } else {
        return res.status(401).json({ message: "Password is incorrect" });
      }
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

exports.getUserProfil = async (req, res) => {
  console.log("getuserprofil");
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const query = `SELECT id_user, username, email_user FROM users WHERE id_user = ?`;
    const [users] = await db.execute(query, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    res.json({ user });
  } catch (error) {
    console.error("Error in getUserProfil:", error);
    return res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email_user, password_user } = req.body;

    console.log("Request Body:", req.body);
    console.log(`Updating user ${userId} with data: `, {
      username,
      email_user,
      password_user,
    });

    // Vérifier quels champs sont présents
    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (email_user) fieldsToUpdate.email_user = email_user;
    if (password_user)
      fieldsToUpdate.password_user = await bcrypt.hash(password_user, 10);

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Construire la requête SQL dynamiquement
    let query = "UPDATE users SET ";
    const values = [];
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      query += `${key} = ?, `;
      values.push(value);
    }
    query = query.slice(0, -2); // Supprimer la dernière virgule
    query += " WHERE id_user = ?";
    values.push(userId);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Récupérer les chemins des images des plantes de l'utilisateur
    const [plants] = await connection.query(
      "SELECT photo FROM plante_suggested WHERE id_user = ?",
      [id]
    );

    // Supprimer les entrées de la table plante_suggested
    await connection.query("DELETE FROM plante_suggested WHERE id_user = ?", [
      id,
    ]);

    // Supprimer l'utilisateur
    const [result] = await connection.query(
      "DELETE FROM users WHERE id_user = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Supprimer les fichiers images associés
    plants.forEach((plant) => {
      if (plant.photo) {
        const filePath = path.resolve(
          __dirname,
          "../../plants-harmony-web/public/",
          plant.photo
        );
        console.log("Attempting to delete:", filePath); // Log the file path

        // Vérifiez que le fichier existe avant de le supprimer
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
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting user" });
  } finally {
    connection.release();
  }
};

exports.getUserStatistics = async (req, res) => {
  try {
    const query = `
      SELECT u.username, 
             COUNT(DISTINCT ps.Id_plante_suggested) AS plant_count,
             COUNT(DISTINCT upi.id_user_plant_interactions) AS interaction_count
      FROM users u
      LEFT JOIN plante_suggested ps ON u.Id_user = ps.Id_user
      LEFT JOIN user_plant_interactions upi ON u.Id_user = upi.user_id
      GROUP BY u.username
    `;
    const [results] = await db.execute(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getUserPlantCounts = async (req, res) => {
  try {
    const query = `
      SELECT u.username,
             COUNT(ps.Id_plante_suggested) AS plant_count
      FROM users u
      LEFT JOIN plante_suggested ps ON u.Id_user = ps.Id_user
      GROUP BY u.username
    `;
    const [results] = await db.execute(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching user plant counts:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getUserTradeRequests = async (req, res) => {
  try {
    const query = `
      SELECT u.username,
             COUNT(r.Id_request) AS trade_request_count
      FROM users u
      LEFT JOIN request r ON u.Id_user = r.Id_user
      GROUP BY u.username
    `;
    const [results] = await db.execute(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching user trade requests:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Nouvelle fonction de suppression pour les administrateurs
exports.adminDeleteUser = async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestingUserId = decoded.id;

    if (!(await isAdmin(requestingUserId))) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    // Récupérer les chemins des images des plantes de l'utilisateur
    const [plants] = await connection.query(
      "SELECT photo FROM plante_suggested WHERE id_user = ?",
      [id]
    );

    // Supprimer les entrées de la table plante_suggested
    await connection.query("DELETE FROM plante_suggested WHERE id_user = ?", [
      id,
    ]);

    // Supprimer les interactions utilisateur-plante
    await connection.query(
      "DELETE FROM user_plant_interactions WHERE user_id = ?",
      [id]
    );

    // Supprimer les demandes de troc
    await connection.query("DELETE FROM request WHERE Id_user = ?", [id]);

    // Supprimer les notifications
    await connection.query("DELETE FROM notifications WHERE user_id = ?", [id]);

    // Supprimer l'utilisateur
    const [result] = await connection.query(
      "DELETE FROM users WHERE id_user = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found" });
    }

    // Supprimer les fichiers images associés
    plants.forEach((plant) => {
      if (plant.photo) {
        const filePath = path.resolve(
          __dirname,
          "../../plants-harmony-web/public/",
          plant.photo
        );
        console.log("Attempting to delete:", filePath); // Log the file path

        // Vérifiez que le fichier existe avant de le supprimer
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

    // Générer un fichier de résumé pour l'utilisateur supprimé
    const userSummaryPath = path.resolve(
      __dirname,
      `../../deleted_users/${id}_summary.txt`
    );
    const userSummaryContent = `
      User ID: ${id}
      Username: ${req.body.username}
      Email: ${req.body.email_user}
      Date Deleted: ${new Date().toISOString()}
    `;
    fs.writeFileSync(userSummaryPath, userSummaryContent);

    await connection.commit();
    res.json({
      message: "User deleted successfully",
      summaryPath: userSummaryPath,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting user" });
  } finally {
    connection.release();
  }
};
