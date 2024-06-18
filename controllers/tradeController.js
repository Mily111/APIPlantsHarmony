const Trade = require("../models/tradeModel");

exports.getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.getAllTrades();
    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTrade = async (req, res) => {
  const { Id_user, Id_plante_suggested, Id_plante_suggested_1 } = req.body;
  try {
    await Trade.createTrade(
      Id_user,
      Id_plante_suggested,
      Id_plante_suggested_1
    );
    res.status(200).json({ message: "Trade request created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTradeById = async (req, res) => {
  const { id } = req.params;
  try {
    const trade = await Trade.getTradeById(id);
    if (!trade.length) {
      return res.status(404).json({ message: "Trade not found du tout" });
    }
    res.status(200).json(trade[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrade = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await Trade.updateTrade(id, data);
    res.status(200).json({ message: "Trade updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTrade = async (req, res) => {
  const { id } = req.params;
  try {
    await Trade.deleteTrade(id);
    res.status(200).json({ message: "Trade deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableTrades = async (req, res) => {
  try {
    const trades = await Trade.getAvailableTrades();
    // if (trades.length === 0) {
    //   return res.status(404).json({ message: "Trade not found" });
    // }
    res.status(200).json(trades);
  } catch (error) {
    console.error("Error fetching available trades: ", error);
    res.status(500).json({ error: error.message });
  }
};
