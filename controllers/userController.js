// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// const path = require("path");
// const validator = require("validator");
// const User = require("../models/userModel"); // Assurez-vous que le chemin est correct

// function isValidEmail(email) {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(String(email).toLowerCase());
// }

// exports.registerUser = async (req, res) => {
//   const { username, email_user, password_user } = req.body;

//   if (!username || !email_user || !password_user) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   if (!isValidEmail(email_user)) {
//     return res.status(400).json({ message: "Invalid email format" });
//   }

//   try {
//     const existingUser = await User.findByUsername(username);
//     if (existingUser.length > 0) {
//       return res.status(409).json({ message: "Username already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password_user, 10);
//     const userData = { username, email_user, password_user: hashedPassword };
//     const result = await User.create(userData);

//     res.status(201).json({
//       message: "User registered successfully",
//       userId: result.insertId,
//     });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { username, password_user } = req.body;

//   try {
//     const users = await User.findByUsername(username);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     if (!user.password_user) {
//       return res.status(403).json({ message: "Password not set for user" });
//     }

//     const match = await bcrypt.compare(password_user, user.password_user);
//     if (match) {
//       const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });

//       console.log("Login successful, sending response", {
//         status: "ok",
//         message: "User logged in successfully",
//         token: token,
//         userId: user.Id_user,
//       });

//       return res.status(200).json({
//         status: "ok",
//         message: "User logged in successfully",
//         token: token,
//         userId: user.Id_user,
//       });
//     } else {
//       return res.status(401).json({ message: "Password is incorrect" });
//     }
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// exports.getUserProfil = async (req, res) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).json({ message: "Token is missing" });
//   }

//   try {
//     // Vérifiez que le token commence par "Bearer "
//     if (!token.startsWith("Bearer ")) {
//       return res.status(400).json({ message: "Token format is invalid" });
//     }

//     // Supprimer le préfixe "Bearer "
//     const actualToken = token.slice(7, token.length);
//     const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
//     const userId = decoded.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching user profile", error: error.message });
//   }
// };

// exports.updateUser = async (req, res) => {
//   const userId = req.params.id;
//   const { username, email_user, password_user } = req.body;

//   const fieldsToUpdate = {};
//   if (username) fieldsToUpdate.username = username;
//   if (email_user) fieldsToUpdate.email_user = email_user;
//   if (password_user)
//     fieldsToUpdate.password_user = await bcrypt.hash(password_user, 10);

//   if (Object.keys(fieldsToUpdate).length === 0) {
//     return res.status(400).json({ message: "No fields to update" });
//   }

//   const query = "UPDATE users SET ? WHERE id_user = ?";
//   const values = [fieldsToUpdate, userId];

//   try {
//     const [result] = await db.query(query, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User updated successfully" });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update user", error: error.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await User.deleteUserById(id);
//     if (!result) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({
//       message: "An error occurred while deleting user",
//       error: error.message,
//     });
//   }
// };

// exports.adminDeleteUser = async (req, res) => {
//   const { id } = req.params;
//   const token = req.headers["authorization"];

//   if (!token) {
//     return res.status(401).json({ message: "Token is missing" });
//   }

//   if (!token.startsWith("Bearer ")) {
//     return res.status(400).json({ message: "Token format is invalid" });
//   }

//   const actualToken = token.slice(7, token.length);

//   try {
//     const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
//     const requestingUserId = decoded.id;

//     if (!(await User.isAdmin(requestingUserId))) {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     const result = await User.deleteUserById(id);
//     if (!result) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({
//       message: "An error occurred while deleting user",
//       error: error.message,
//     });
//   }
// };

// exports.getUserStatistics = async (req, res) => {
//   const query = `
//     SELECT u.username,
//            COUNT(DISTINCT ps.Id_plante_suggested) AS plant_count,
//            COUNT(DISTINCT upi.id_user_plant_interactions) AS interaction_count
//     FROM users u
//     LEFT JOIN plante_suggested ps ON u.id_user = ps.id_user
//     LEFT JOIN user_plant_interactions upi ON u.id_user = upi.user_id
//     GROUP BY u.username
//   `;
//   try {
//     const [results] = await db.execute(query);
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching user statistics:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// exports.getUserPlantCounts = async (req, res) => {
//   const query = `
//     SELECT u.username,
//            COUNT(ps.id_plante_suggested) AS plant_count
//     FROM users u
//     LEFT JOIN plante_suggested ps ON u.id_user = ps.id_user
//     GROUP BY u.username
//   `;
//   try {
//     const [results] = await db.execute(query);
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching user plant counts:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// exports.getUserTradeRequests = async (req, res) => {
//   const query = `
//     SELECT u.username,
//            COUNT(r.id_request) AS trade_request_count
//     FROM users u
//     LEFT JOIN request r ON u.id_user = r.id_user
//     GROUP BY u.username
//   `;
//   try {
//     const [results] = await db.execute(query);
//     res.json(results);
//   } catch (error) {
//     console.error("Error fetching user trade requests:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
// const validator = require("validator");
const User = require("../models/userModel"); // Assurez-vous que le chemin est correct

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

exports.registerUser = async (req, res) => {
  const { username, email_user, password_user } = req.body;

  if (!username || !email_user || !password_user) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!isValidEmail(email_user)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password_user, 10);
    const userData = { username, email_user, password_user: hashedPassword };
    const result = await User.create(userData);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// exports.loginUser = async (req, res) => {
//   const { username, password_user } = req.body;

//   try {
//     const users = await User.findByUsername(username);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     if (!user.password_user) {
//       return res.status(403).json({ message: "Password not set for user" });
//     }

//     const match = await bcrypt.compare(password_user, user.password_user);
//     if (match) {
//       const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });

//       return res.status(200).json({
//         status: "ok",
//         message: "User logged in successfully",
//         token: token,
//         userId: user.id_user,
//       });
//     } else {
//       return res.status(401).json({ message: "Password is incorrect" });
//     }
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

exports.loginUser = async (req, res) => {
  const { username, password_user } = req.body;

  try {
    const users = await User.findByUsername(username);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (!user.password_user) {
      return res.status(403).json({ message: "Password not set for user" });
    }

    const match = await bcrypt.compare(password_user, user.password_user);
    if (match) {
      // Note: Ensure the user ID is correctly referenced here
      const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        status: "ok",
        message: "User logged in successfully",
        token: token,
        userId: user.Id_user, // Ensure this matches the correct field from your database
      });
    } else {
      return res.status(401).json({ message: "Password is incorrect" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// exports.loginUser = async (req, res) => {
//   const { username, password_user } = req.body;

//   try {
//     const users = await User.findByUsername(username);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     if (!user.password_user) {
//       return res.status(403).json({ message: "Password not set for user" });
//     }

//     const match = await bcrypt.compare(password_user, user.password_user);
//     if (match) {
//       // Incluez l'ID utilisateur dans le payload du token
//       const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
//         expiresIn: "1h",
//       });

//       return res.status(200).json({
//         status: "ok",
//         message: "User logged in successfully",
//         token: token,
//         userId: user.id_user,
//       });
//     } else {
//       return res.status(401).json({ message: "Password is incorrect" });
//     }
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     return res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// exports.getUserProfil = async (req, res) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).json({ message: "Token is missing" });
//   }

//   try {
//     const actualToken = token.startsWith("Bearer ")
//       ? token.slice(7, token.length)
//       : token;
//     const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     console.log("Decoded user ID:", userId); // Ajoutez ce log
//     const user = await User.getProfile(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching user profile", error: error.message });
//   }
// };

exports.getUserProfil = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const actualToken = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    console.log("Decoded token:", decoded); // Ajoutez ce log
    console.log("Decoded user ID:", userId); // Ajoutez ce log

    const user = await User.getProfile(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

// exports.getUserProfil = async (req, res) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).json({ message: "Token is missing" });
//   }

//   try {
//     const actualToken = token.startsWith("Bearer ")
//       ? token.slice(7, token.length)
//       : token;
//     const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     console.log("Decoded user ID:", userId); // Ajoutez ce log
//     const user = await User.getProfile(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching user profile", error: error.message });
//   }
// };

// exports.updateUser = async (req, res) => {
//   const userId = req.params.id;
//   const { username, email_user, password_user } = req.body;

//   const fieldsToUpdate = {};
//   if (username) fieldsToUpdate.username = username;
//   if (email_user) fieldsToUpdate.email_user = email_user;
//   if (password_user)
//     fieldsToUpdate.password_user = await bcrypt.hash(password_user, 10);

//   if (Object.keys(fieldsToUpdate).length === 0) {
//     return res.status(400).json({ message: "No fields to update" });
//   }

//   const query = "UPDATE users SET ? WHERE id_user = ?";
//   const values = [fieldsToUpdate, userId];

//   try {
//     const [result] = await db.query(query, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User updated successfully" });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to update user", error: error.message });
//   }
// };

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email_user, password_user } = req.body;

  const fieldsToUpdate = {};
  if (username) fieldsToUpdate.username = username;
  if (email_user) fieldsToUpdate.email_user = email_user;
  if (password_user)
    fieldsToUpdate.password_user = await bcrypt.hash(password_user, 10);

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const result = await User.updateUser(userId, fieldsToUpdate);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.deleteUserById(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error.message,
    });
  }
};

exports.adminDeleteUser = async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  if (!token.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Token format is invalid" });
  }

  const actualToken = token.slice(7, token.length);

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    const requestingUserId = decoded.id;

    if (!(await User.isAdmin(requestingUserId))) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const result = await User.deleteUserById(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "An error occurred while deleting user",
      error: error.message,
    });
  }
};

exports.getUserStatistics = async (req, res) => {
  try {
    const results = await User.getUserStatistics();
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
    const results = await User.getUserPlantCounts();
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
    const results = await User.getUserTradeRequests();
    res.json(results);
  } catch (error) {
    console.error("Error fetching user trade requests:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
