const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userRoutes = require("./routes/userRoutes");
const plantRoutes = require("./routes/plantRoutes");
const plantAdviceRoutes = require("./routes/plantAdviceRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
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

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/plantsAdvice", plantAdviceRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
