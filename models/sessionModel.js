const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Session = {
  login: async (username, password) => {
    try {
      const query = `SELECT * FROM users WHERE username = ?`;
      const [users] = await db.execute(query, [username]);

      if (users.length === 0) {
        throw new Error("User not found");
      }

      const user = users[0];

      const match = await bcrypt.compare(password, user.password_user);
      if (!match) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return { token, userId: user.Id_user, username: user.username };
    } catch (error) {
      throw error;
    }
  },

  logout: async (req, res) => {
    // Logique de déconnexion (si nécessaire)
  },

  checkStatus: async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
};

module.exports = Session;
