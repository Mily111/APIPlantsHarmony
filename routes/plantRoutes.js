const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/plantsName", plantController.getPlantNames);
router.post(
  "/plantSuggestion",
  upload.single("photo"),
  plantController.addPlantSuggestion
);

// router.get("/", plantController.getAllPlants);
// router.post("/", plantController.createPlant);
// router.get("/:id", plantController.getPlantById);
// router.put("/:id", plantController.updatePlant);
// router.delete("/:id", plantController.deletePlant);

module.exports = router;
