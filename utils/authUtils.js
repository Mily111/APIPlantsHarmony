// authUtils.js
const db = require("../config/db");

async function isAdmin(userId) {
  const [rows] = await db.query(
    "SELECT id_type_user_rights FROM users WHERE id_user = ?",
    [userId]
  );

  if (rows.length > 0 && rows[0].id_type_user_rights === 1) {
    // Supposons que 1 correspond à admin
    return true;
  }
  return false;
}

module.exports = { isAdmin };
