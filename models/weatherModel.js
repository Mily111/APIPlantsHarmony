// models/weatherModel.js

class Weather {
  constructor(location, temperature, condition) {
    this.location = location;
    this.temperature = temperature;
    this.condition = condition;
  }
}

module.exports = Weather;
