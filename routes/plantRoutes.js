const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const multer = require("multer");
const path = require("path");
// Définissez le chemin complet vers le dossier public/images/plants de votre application Next.js
// Chemin vers le dossier public/images/plants de votre application Next.js

const nextjsPublicPath = path.join(
  __dirname,
  "../../plants_harmony_web/public/images/plants"
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
router.get("/available", plantController.getAvailablePlants);
router.post(
  "/plantSuggestion",
  upload.single("photo"),
  plantController.addPlantSuggestion
);
router.get("/getUserPlant/:userId", plantController.getUserPlants);

router.delete("/deleteUserPlant/:plantId", plantController.deleteUserPlant);

// Route pour mettre à jour l'état d'une plante
router.put("/:id/state", plantController.updatePlantState);

router.get("/careSummary/:userId", plantController.getPlantCareSummary);

router.get(
  "/user/:userId/plantsInteractions",
  plantController.getUserPlantsWithInteractions
);

module.exports = router;
