// routes/interactionRoutes.js
const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/interactionController");

router.post("/add", interactionController.addInteraction);
router.get("/user/:userId", interactionController.getInteractionsForUser);
router.get("/types", interactionController.getInteractionTypes);

module.exports = router;
