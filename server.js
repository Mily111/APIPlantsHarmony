const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const plantRoutes = require("./routes/plantRoutes");
const tradeRoutes = require("./routes/tradeRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Configuration CORS pour autoriser toutes les origines
app.use(cors());

app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/trades", tradeRoutes);

module.exports = app;
