const db = require("../config/db");

const Trade = {
  getAllTrades: async () => {
    try {
      const [rows] = await db.query(`
        SELECT r.*, ps.photo, ps.state_exchange, gp.name_plant, u.username 
        FROM request r
        JOIN plante_suggested ps ON r.Id_plante_suggested = ps.Id_plante_suggested
        JOIN generic_plants gp ON ps.Id_plant = gp.Id_plant
        JOIN users u ON r.Id_user = u.Id_user
        WHERE r.date_validation IS NULL
      `);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  createTrade: async (Id_user, Id_plante_suggested, Id_plante_suggested_1) => {
    try {
      await db.query(
        "INSERT INTO request (Id_user, Id_plante_suggested, Id_plante_suggested_1, date_request) VALUES (?, ?, ?, NOW())",
        [Id_user, Id_plante_suggested, Id_plante_suggested_1]
      );
    } catch (err) {
      throw err;
    }
  },
  getTradeById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM request WHERE Id_request = ?",
        [id]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  },
  updateTrade: async (id, data) => {
    try {
      await db.query("UPDATE request SET ? WHERE Id_request = ?", [data, id]);
    } catch (err) {
      throw err;
    }
  },
  deleteTrade: async (id) => {
    try {
      await db.query("DELETE FROM request WHERE Id_request = ?", [id]);
    } catch (err) {
      throw err;
    }
  },
  getAvailableTrades: async () => {
    try {
      const [rows] = await db.query(`
          SELECT ps.Id_plante_suggested, ps.photo, ps.state_exchange, gp.name_plant, u.username
          FROM plante_suggested ps
          JOIN generic_plants gp ON ps.Id_plant = gp.Id_plant
          JOIN users u ON ps.Id_user = u.Id_user
          WHERE ps.state_exchange = 'disponible'
        `);

      console.log("Query result:", rows);

      if (!rows || rows.length === 0) {
        return [];
      }
      return rows;
    } catch (err) {
      console.error("Error fetching available trades:", err);
      throw err;
    }
  },
};

module.exports = Trade;
