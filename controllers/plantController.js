const plantModel = require("../models/plantModel");

exports.getPlantNames = async (req, res) => {
  try {
    const plants = await plantModel.getPlantNamesFromDB();
    res.json(plants);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des noms de plantes" });
  }
};

exports.addPlantSuggestion = async (req, res) => {
  const { plantName, stateExchange, userId } = req.body;
  const photo = req.file ? `images/plants/${req.file.filename}` : null;

  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  if (!plantName || !stateExchange || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await plantModel.addOrUpdatePlantSuggestion({
      plantName,
      stateExchange,
      photo,
      userId,
    });
    res.json({ message: "Plant suggestion added or updated" });
  } catch (error) {
    console.error("Error adding or updating plant suggestion:", error);
    res.status(500).json({
      message:
        "Erreur lors de l'ajout ou de la mise à jour de la suggestion de plante",
    });
  }
};
