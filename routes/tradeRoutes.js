// routes/tradeRoutes.js

const express = require("express");
const router = express.Router();
const tradeController = require("../controllers/tradeController");

// Route pour obtenir toutes les demandes d'échange
router.get("/getAll", tradeController.getAllTrades);

// Route pour créer une nouvelle demande d'échange
router.post("/create", tradeController.createTrade);

// Route pour obtenir une demande d'échange par ID
router.get("/getTrade/:id", tradeController.getTradeById);

// Route pour mettre à jour une demande d'échange par ID
router.put("/upadteTrade/:id", tradeController.updateTrade);

// Route pour supprimer une demande d'échange par ID
router.delete("/deleteTrade/:id", tradeController.deleteTrade);

// Route pour obtenir les plantes disponibles pour l'échange
router.get("/available", tradeController.getAvailableTrades);

module.exports = router;
