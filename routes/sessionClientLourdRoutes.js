const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.post("/loginClientLourd", sessionController.login);
router.post("/logoutClientLourd", sessionController.logout);
router.get("/statusClientLourd", sessionController.checkStatus);

module.exports = router;
