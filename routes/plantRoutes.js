const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const multer = require("multer");
const path = require("path");
// Définissez le chemin complet vers le dossier public/images/plants de votre application Next.js
const nextjsPublicPath = path.join(
  __dirname,
  "../../PLANTS-HARMONY-WEB/public/images/plants"
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, nextjsPublicPath);
  },
  filename: function (req, file, cb) {
    const plantName = req.body.plantName.replace(/\s+/g, "_").toLowerCase(); // Remplacer les espaces par des underscores et convertir en minuscule
    const extension = path.extname(file.originalname);
    cb(null, `${plantName}${extension}`);
  },
});

const upload = multer({ storage: storage });

router.get("/plantsName", plantController.getPlantNames);
router.post(
  "/plantSuggestion",
  upload.single("photo"),
  plantController.addPlantSuggestion
);

module.exports = router;
