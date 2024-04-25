const db = require("../config/db"); // Assurez-vous que le chemin est correct
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
  const { username, email_user, password_user } = req.body;

  if (!username || !email_user || !password_user) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password_user, 10);
    const query = `INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)`;
    const [results] = await db.execute(query, [
      username,
      email_user,
      hashedPassword,
    ]);

    res
      .status(201)
      .json({ message: "New user registered", userId: results.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering new user", error: error.message });
  }
};

// const User = require("../models/userModel");
// const jwt = require("jsonwebtoken");

// exports.registerUser = async (req, res) => {
//   User.create(req.body, (error, results) => {
//     if (error) {
//       res.status(500).json({ message: "Error registering new user", error });
//     } else {
//       res
//         .status(201)
//         .json({ message: "New user registered", userId: results.insertId });
//     }
//   });
// };

// userController.js
// exports.registerUser = async (req, res) => {
//   const { username, email_user, password_user } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password_user, 10);
//     const result = await db.query(
//       "INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)",
//       [username, email_user, hashedPassword]
//     );

//     res
//       .status(201)
//       .send({
//         message: "User registered successfully",
//         userId: result.insertId,
//       });
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: "Failed to register user", error: error.message });
//   }
// };

exports.loginUser = (req, res) => {
  User.findByUsername(req.body.username, async (error, users) => {
    if (error) {
      return res.status(500).json({ message: "Error logging in", error });
    }
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];
    const passwordIsValid = await bcrypt.compare(
      req.body.password_user,
      user.password_user
    );
    if (!passwordIsValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "User logged in successfully", token });
  });
};

// exports.registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

// exports.getAllUsers = (req, res) => {
//   db.query("SELECT * FROM users", (err, results) => {
//     if (err) {
//       res.status(500).send("Error retrieving users from database");
//     } else {
//       res.status(200).json(results);
//     }
//   });
// };

// exports.createUser = (req, res) => {
//   const { username, email_user, password_user, Id_type_user_rights } = req.body;
//   db.query(
//     "INSERT INTO users (username, email_user, password_user, Id_type_user_rights) VALUES (?, ?, ?, ?)",
//     [username, email_user, password_user, Id_type_user_rights],
//     (err, result) => {
//       if (err) {
//         res.status(500).send({ message: "Error creating user", error: err });
//       } else {
//         res
//           .status(201)
//           .send({
//             message: "User created successfully",
//             userId: result.insertId,
//           });
//       }
//     }
//   );
// };

// exports.getUserById = (req, res) => {
//   // Add logic to get a user by ID
// };

// exports.updateUser = (req, res) => {
//   // Add logic to update a user
// };

// exports.deleteUser = (req, res) => {
//   // Add logic to delete a user
// };
