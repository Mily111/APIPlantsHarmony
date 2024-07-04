const db = require("../config/db"); // Assurez-vous que le chemin est correct
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
// exports.registerUser = async (req, res) => {
//   const { username, email_user, password_user } = req.body;

//   // Validation des champs requis
//   if (!username || !email_user || !password_user) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   // Validation de l'email
//   if (!isValidEmail(email_user)) {
//     return res.status(400).json({ message: "Invalid email format" });
//   }

//   // Vérifier l'existence du nom d'utilisateur ou de l'email
//   try {
//     const checkUser = `SELECT * FROM users WHERE username = ? OR email_user = ?`;
//     const [userExists] = await db.execute(checkUser, [username, email_user]);

//     if (userExists.length > 0) {
//       return res
//         .status(409)
//         .json({ message: "Username or email already exists" });
//     }
//   } catch (checkError) {
//     return res.status(500).json({
//       message: "Internal server error",
//       error: checkError.message,
//     });
//   }

//   // Essayer de créer l'utilisateur
//   try {
//     const hashedPassword = await bcrypt.hash(password_user, 10);
//     const query = `INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)`;
//     const [results] = await db.execute(query, [
//       username,
//       email_user,
//       hashedPassword,
//     ]);

//     res.status(201).json({
//       message: "User registered successfully",
//       userId: results.insertId,
//     });
//   } catch (checkError) {
//     // Utiliser un message générique pour toutes les erreurs serveur
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: checkError.message });
//   }
// };

// function isValidEmail(email) {
//   return /\S+@\S+\.\S+/.test(email);
// }

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

// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [result] = await db.query("DELETE FROM users WHERE id_user = ?", [
//       id,
//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ message: "An error occurred while deleting user" });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Récupérer les chemins des images des plantes de l'utilisateur
//     const [plants] = await db.query(
//       "SELECT photo FROM plante_suggested WHERE id_user = ?",
//       [id]
//     );

//     // Supprimer les entrées de la table plante_suggested
//     await db.query("DELETE FROM plante_suggested WHERE id_user = ?", [id]);

//     // Supprimer l'utilisateur
//     const [result] = await db.query("DELETE FROM users WHERE id_user = ?", [
//       id,
//     ]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Supprimer les fichiers images associés
//     plants.forEach((plant) => {
//       if (plant.photo) {
//         const filePath = path.join(
//           __dirname,
//           "../../plants-harmony-web/public/images/plants"
//         );
//         fs.unlink(filePath, (err) => {
//           if (err) {
//             console.error("Erreur lors de la suppression de l'image:", err);
//           }
//         });
//       }
//     });

//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ message: "An error occurred while deleting user" });
//   }
// };

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
