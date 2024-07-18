// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const session = require("express-session");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const userRoutes = require("./routes/userRoutes");
// const plantRoutes = require("./routes/plantRoutes");
// const plantAdviceRoutes = require("./routes/plantAdviceRoutes");
// const tradeRoutes = require("./routes/tradeRoutes");
// const weatherRoutes = require("./routes/weatherRoutes");
// const sessionClientLourdRoutes = require("./routes/sessionClientLourdRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const interactionRoutes = require("./routes/interactionRoutes");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const path = require("path");
// const helmet = require("helmet");

// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "User API",
//       version: "1.0.0",
//       description: "API for creating and managing users",
//       contact: {
//         name: "Example Developer",
//       },
//       servers: [{ url: "http://localhost:5000" }],
//     },
//   },
//   apis: ["./routes/*.js"], // path to the API docs
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// const app = express();

// // Chemin relatif basé sur la position du fichier serveur
// const nextjsPublicPath = path.join(
//   __dirname,
//   "../plants_harmony_web/public/images/plants"
// );

// // Servir les fichiers statiques
// app.use("/images/plants", express.static(nextjsPublicPath));

// // Middleware
// app.use(helmet());
// app.use(cors());
// app.use(bodyParser.json());
// app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());
// // Middleware pour analyser les requêtes JSON
// app.use(express.json());

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/plants", plantRoutes);
// app.use("/api/plantsAdvice", plantAdviceRoutes);
// app.use("/api/trades", tradeRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/sessionsClientLourd", sessionClientLourdRoutes);
// app.use("/api/weather", weatherRoutes);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use("/api/interactions", interactionRoutes);

// module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const userRoutes = require("./routes/userRoutes");
const plantRoutes = require("./routes/plantRoutes");
const plantAdviceRoutes = require("./routes/plantAdviceRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const sessionClientLourdRoutes = require("./routes/sessionClientLourdRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const helmet = require("helmet");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");

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
const csrfProtection = csurf({ cookie: true });

// Chemin relatif basé sur la position du fichier serveur
const nextjsPublicPath = path.join(
  __dirname,
  "../plants_harmony_web/public/images/plants"
);

// Servir les fichiers statiques
app.use("/images/plants", express.static(nextjsPublicPath));

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // URL de votre application frontale
    credentials: true, // Permet d'envoyer les cookies avec les requêtes
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Appliquez le middleware CSRF après cookieParser et session
app.use(csrfProtection);

// Route pour obtenir le token CSRF
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/plantsAdvice", plantAdviceRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sessionsClientLourd", sessionClientLourdRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/interactions", interactionRoutes);

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403).json({ message: "Form tampered with" });
  } else {
    next(err);
  }
});

module.exports = app;
