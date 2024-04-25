const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");

router.get("/", tradeController.getAllTrades);
router.post("/", tradeController.createTrade);
router.get("/:id", tradeController.getTradeById);
router.put("/:id", tradeController.updateTrade);
router.delete("/:id", tradeController.deleteTrade);

module.exports = router;
