// controllers/weatherController.js

const axios = require("axios");
const cheerio = require("cheerio");
const Weather = require("../models/weatherModel");

exports.getWeather = async (req, res) => {
  try {
    const response = await axios.get(
      "https://meteofrance.com/previsions-meteo-france/montpellier/34000"
    ); // Remplacez par l'URL du site de météo à scraper
    const html = response.data;
    const $ = cheerio.load(html);

    // Remplacez les sélecteurs ci-dessous par les sélecteurs appropriés pour le site que vous scrapez
    const location = $(
      ".favori-link ./previsions-meteo-france/montpellier/34000"
    )
      .text()
      .trim();
    const temperature = $(".temp").text().trim();
    const condition = $(".wind-speed").text().trim();

    const weatherData = new Weather(location, temperature, condition);

    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};
