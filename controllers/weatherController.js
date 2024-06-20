// controllers/weatherController.js

const puppeteer = require("puppeteer");
const Weather = require("../models/weatherModel");

exports.getWeather = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://meteofrance.com/previsions-meteo-france/montpellier/34000"
    );

    // Attendre que les éléments nécessaires soient chargés
    await page.waitForSelector(".weather_temp p");
    await page.waitForSelector(".weather_temp img");
    await page.waitForSelector(".wind strong");

    const weatherData = await page.evaluate(() => {
      const location = document.querySelector("title")?.innerText.trim();
      const temperature = document
        .querySelector(".weather_temp p")
        ?.innerText.trim();
      const condition = document
        .querySelector(".weather_temp img")
        ?.getAttribute("title")
        .trim();
      const windSpeed = document
        .querySelector(".wind strong")
        ?.innerText.trim();
      return { location, temperature, condition, windSpeed };
    });

    console.log("Scraped Data:", weatherData);

    await browser.close();

    if (
      !weatherData.temperature ||
      !weatherData.condition ||
      !weatherData.windSpeed
    ) {
      throw new Error("Failed to scrape necessary weather data.");
    }

    const weather = new Weather(
      weatherData.location,
      weatherData.temperature,
      weatherData.condition,
      weatherData.windSpeed
    );
    res.status(200).json(weather);
  } catch (error) {
    console.error("Error in getWeather:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

// controllers/weatherController.js

// const axios = require("axios");
// const cheerio = require("cheerio");
// const Weather = require("../models/weatherModel");

// exports.getWeather = async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://meteofrance.com/previsions-meteo-france/montpellier/34000"
//     );
//     const html = response.data;
//     const $ = cheerio.load(html);

//     const locationElement = $("title");
//     const location = locationElement.length
//       ? locationElement.text().trim()
//       : null;
//     console.log("Location Element HTML:", locationElement.html());

//     const temperatureElement = $(".weather_temp p").first();
//     const temperature = temperatureElement.length
//       ? temperatureElement.text().trim()
//       : null;
//     console.log("Temperature Element HTML:", temperatureElement.html());

//     const conditionElement = $(".icon shape-weather img").first();
//     const condition = conditionElement.length
//       ? conditionElement.attr("title").trim()
//       : null;
//     console.log("Condition Element HTML:", conditionElement.html());

//     const windSpeedElement = $(".wind p strong").first();
//     const windSpeed = windSpeedElement.length
//       ? windSpeedElement.text().trim()
//       : null;
//     console.log("Wind Speed Element HTML:", windSpeedElement.html());

//     console.log("Scraped Data:", {
//       location,
//       temperature,
//       condition,
//       windSpeed,
//     });

//     if (!temperature || !condition || !windSpeed) {
//       throw new Error("Failed to scrape necessary weather data.");
//     }

//     const weatherData = new Weather(
//       location,
//       temperature,
//       condition,
//       windSpeed
//     );
//     res.status(200).json(weatherData);
//   } catch (error) {
//     console.error("Error in getWeather:", error.message);
//     res.status(500).json({ error: "Failed to fetch weather data" });
//   }
// };
