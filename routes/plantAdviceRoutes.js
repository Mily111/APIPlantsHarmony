// routes/plantAdviceRoutes.js
const express = require("express");
const router = express.Router();
const plantAdviceController = require("../controllers/plantAdviceController");

router.get("/getAllPlants", plantAdviceController.getAllPlants);

module.exports = router;
