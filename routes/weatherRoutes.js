// routes/weatherRoutes.js

const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get("/getWeatherData", weatherController.getWeather);

module.exports = router;
