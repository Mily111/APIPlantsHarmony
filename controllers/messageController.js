// controllers/messageController.js
const messageModel = require("../models/messageModel");

exports.createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, tradeId } = req.body;
    const messageId = await messageModel.createMessage({
      senderId,
      receiverId,
      content,
      tradeId,
    });
    res
      .status(201)
      .json({ message: "Message created successfully", messageId });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Error creating message" });
  }
};

exports.getMessagesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await messageModel.getMessagesForUser(userId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages for user:", error);
    res.status(500).json({ message: "Error fetching messages for user" });
  }
};
