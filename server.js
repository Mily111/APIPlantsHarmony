const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const plantRoutes = require("./routes/plantRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API for creating and managing users",
      contact: {
        name: "Example Developer",
      },
      servers: [{ url: "http://localhost:5000" }],
    },
  },
  apis: ["./routes/*.js"], // path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const app = express();
const port = process.env.PORT || 5000;

// Configuration CORS pour autoriser toutes les origines
app.use(cors());

app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/trades", tradeRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
