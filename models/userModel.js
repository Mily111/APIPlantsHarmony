// models/userModel.js
const db = require("../config/db");

const User = {
  create: async (userData) => {
    try {
      const [result] = await db.query(
        "INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)",
        [userData.username, userData.email_user, userData.password_user]
      );
      return result;
    } catch (err) {
      throw err;
    }
  },

  findByUsername: async (username) => {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
      return rows;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = User;

// const db = require("../config/db");
// const bcrypt = require("bcrypt");

// const User = {
//   create: async (userData, callback) => {
//     const hashedPassword = await bcrypt.hash(userData.password_user, 10);
//     db.query(
//       "INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)",
//       [userData.username, userData.email_user, hashedPassword],
//       callback
//     );
//   },

//   findByUsername: (username, callback) => {
//     db.query("SELECT * FROM users WHERE username = ?", [username], callback);
//   },
// };

// module.exports = User;
