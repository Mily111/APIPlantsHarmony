const express = require("express");
const router = express.Router();
const resetController = require("../controllers/resetController");

router.post("/reset-database", resetController.resetDatabase);

module.exports = router;
