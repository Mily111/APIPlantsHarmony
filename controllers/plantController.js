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
  const photo = req.file.path;

  try {
    const result = await plantModel.addPlantSuggestionToDB({
      plantName,
      stateExchange,
      photo,
      userId,
    });
    if (result) {
      res.json({ message: "Plant suggestion added" });
    } else {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout de la plante suggérée" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de la plante suggérée" });
  }
};
