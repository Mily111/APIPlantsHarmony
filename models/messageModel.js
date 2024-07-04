// models/messageModel.js
const db = require("../config/db");

async function createMessage({ senderId, receiverId, content, tradeId }) {
  const query = `
    INSERT INTO messages (sender_id, receiver_id, content, trade_id, date_sent)
    VALUES (?, ?, ?, ?, NOW())
  `;
  try {
    const [result] = await db.execute(query, [
      senderId,
      receiverId,
      content,
      tradeId,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error("Database error");
  }
}

async function getMessagesForUser(userId) {
  const query = `
    SELECT m.*, u.username AS sender_username
    FROM messages m
    JOIN users u ON m.sender_id = u.id_user
    WHERE m.receiver_id = ?
    ORDER BY m.date_sent DESC
  `;
  try {
    const [results] = await db.execute(query, [userId]);
    return results;
  } catch (error) {
    console.error("Error fetching messages for user:", error);
    throw new Error("Database error");
  }
}

module.exports = {
  createMessage,
  getMessagesForUser,
};
