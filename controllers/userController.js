const db = require("../config/db"); // Assurez-vous que le chemin est correct
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email_user, password_user } = req.body;

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
  } catch (checkError) {
    // Utiliser un message générique pour toutes les erreurs serveur
    return res
      .status(500)
      .json({ message: "Internal server error", error: checkError.message });
  }
};

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

exports.loginUser = async (req, res) => {
  const { username, password_user } = req.body;
  console.log("Received username:", username); // Affiche le nom d'utilisateur reçu
  console.log("Received password_user:", password_user); // Affiche le mot de passe reçu

  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const [users] = await db.execute(query, [username]);
    console.log("User query result:", users); // Affiche le résultat de la requête

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    if (!user.password_user) {
      return res.status(404).json({ message: "Password not set for user" });
    }
    const passwordIsValid = await bcrypt.compare(
      password_user,
      user.password_user
    );

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};

// exports.getAllUsers = (req, res) => {
//   db.query("SELECT * FROM users", (err, results) => {
//     if (err) {
//       res.status(500).send("Error retrieving users from database");
//     } else {
//       res.status(200).json(results);
//     }
//   });
// };

// exports.updateUser = (req, res) => {
//   // Add logic to update a user
// };

// exports.deleteUser = (req, res) => {
//   // Add logic to delete a user
// };
