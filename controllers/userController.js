const db = require("../config/db"); // Assurez-vous que le chemin est correct
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// exports.loginUser = async (req, res) => {
//   const { username, password_user } = req.body;

//   // Validation des champs requis
//   if (!username || !password_user) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const query = `SELECT * FROM users WHERE username =?`;
//     const [users] = await db.execute(query, [username]);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     // Utilisation de bcrypt.compare avec une fonction de rappel pour comparer le mot de passe
//     bcrypt.compare(
//       user.password_user.toString(),
//       password_user,
//       (err, result) => {
//         if (err) {
//           console.error("Erreur lors de la comparaison du mot de passe:", err);
//           return res.status(500).json({
//             message: "Erreur lors de la connexion",
//             error: err.message,
//           });
//         }
//         console.log("test:", req.body);
//         if (result) {
//           // Générer et renvoyer le token JWT si le mot de passe est correct
//           // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//           //   expiresIn: "1d",
//           // });
//           // console.log(token);
//           // res.cookie("token connexion", token);
//           return res.status(200).json({ message: "Connected" });
//         } else {
//           return res.status(401).json({ message: "Error bad password" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error in loginUser:", error);
//     return res
//       .status(500)
//       .json({ message: "Error logging in", error: error.message });
//   }
// };

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

// exports.loginUser = async (req, res) => {
//   const { username, password_user } = req.body;

//   try {
//     const query = `SELECT * FROM users WHERE username = ?`;
//     const [users] = await db.execute(query, [username]);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     if (!user.password_user) {
//       return res.status(403).json({ message: "Password not set for user" });
//     }

//     bcrypt.compare(password_user, user.password_user, (err, result) => {
//       if (err) {
//         console.error("Error comparing passwords:", err);
//         return res.status(500).json({ message: "Internal server error" });
//       }

//       if (result) {
//         const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
//           expiresIn: "1h",
//         });

//         return res.status(200).json({
//           Status: "ok",
//           message: "User logged in successfully",
//           token: token,
//         });
//       } else {
//         return res.status(401).json({ message: "Password is incorrect" });
//       }
//     });
//   } catch (error) {
//     console.error("Error in loginUser:", error);
//     return res
//       .status(500)
//       .json({ message: "Error logging in", error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { username, password_user } = req.body;

//   // Log les valeurs pour diagnostic
//   console.log("Received login request:", { username, password_user });

//   // Vérification que `username` et `password_user` sont définis
//   if (!username || !password_user) {
//     console.error("Missing required fields:", { username, password_user });
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const query = `SELECT * FROM users WHERE username = ?`;
//     const [users] = await db.execute(query, [username]);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     // Vérification que `user.password_user` est défini
//     if (!user.password_user) {
//       console.error("Password not set for user:", user);
//       return res.status(403).json({ message: "Password not set for user" });
//     }

//     console.log("Comparing passwords:", password_user, user.password_user); // Log des mots de passe

//     // Vérification supplémentaire pour les types de données
//     if (
//       typeof password_user !== "string" ||
//       typeof user.password_user !== "string"
//     ) {
//       console.error("Invalid types for passwords:", {
//         password_user,
//         user_password: user.password_user,
//       });
//       return res.status(500).json({ message: "Invalid password types" });
//     }

//     bcrypt.compare(password_user, user.password_user, (err, result) => {
//       if (err) {
//         console.error("Error comparing passwords:", err);
//         return res.status(500).json({ message: "Internal server error" });
//       }

//       if (result) {
//         const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
//           expiresIn: "1h",
//         });

//         return res.status(200).json({
//           status: "ok",
//           message: "User logged in successfully",
//           token: token,
//           userId: user.Id_user, // Utilisez Id_user pour renvoyer l'ID utilisateur
//         });
//       } else {
//         return res.status(401).json({ message: "Password is incorrect" });
//       }
//     });
//   } catch (error) {
//     console.error("Error in loginUser:", error);
//     return res
//       .status(500)
//       .json({ message: "Error logging in", error: error.message });
//   }
// };

exports.getUserProfil = async (req, res) => {
  console.log("getuserprofil");
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const query = `SELECT username, email_user FROM users WHERE Id_user = ?`;
    const [users] = await db.execute(query, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    res.json({ user });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};
