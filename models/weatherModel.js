// models/weatherModel.js

class Weather {
  constructor(location, temperature, condition, windSpeed) {
    this.location = location;
    this.temperature = temperature;
    this.condition = condition;
    this.windSpeed = windSpeed;
  }
}

module.exports = Weather;
