const db = require("../config/db");

exports.resetDatabase = async (req, res) => {
  try {
    // Logique pour réinitialiser la base de données
    await db.execute("DELETE FROM users WHERE isTestUser = true");
    // Ajoutez d'autres opérations de réinitialisation si nécessaire
    res.status(200).send("Database reset");
  } catch (error) {
    res.status(500).send("Failed to reset database");
  }
};
