const db = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
  create: async (userData, callback) => {
    const hashedPassword = await bcrypt.hash(userData.password_user, 10);
    db.query(
      "INSERT INTO users (username, email_user, password_user) VALUES (?, ?, ?)",
      [userData.username, userData.email_user, hashedPassword],
      callback
    );
  },

  findByUsername: (username, callback) => {
    db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  },
};

module.exports = User;
