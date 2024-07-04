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

exports.getUserPlants = async (req, res) => {
  const userId = req.params.userId;
  try {
    console.log(`Fetching plants for user ID: ${userId}`); // Log user ID
    const plants = await plantModel.getUserPlants(userId); // Utilisez la fonction du modèle

    if (plants.length === 0) {
      console.log(`No plants found for user ID: ${userId}`); // Log when no plants found
      return res.status(404).json({ message: "No plants found" });
    }
    console.log(`Plants found for user ID: ${userId}`, plants); // Log when plants are found
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error fetching user's plants:", error); // Log error
    res.status(500).json({ message: "An error occurred on the server", error });
  }
};

exports.deleteUserPlant = async (req, res) => {
  const plantId = req.params.plantId;
  console.log(`Attempting to delete plant with ID: ${plantId}`); // Log l'ID de la plante

  try {
    const result = await plantModel.deleteUserPlantByID(plantId);
    console.log(`Deletion result: ${JSON.stringify(result)}`); // Log le résultat de la suppression
    res.status(200).json({ message: "Plant deleted successfully" });
  } catch (error) {
    console.error("Error deleting user plant:", error);
    res.status(500).json({ message: "An error occurred on the server", error });
  }
};

// Fonction pour mettre à jour l'état d'une plante
exports.updatePlantState = async (req, res) => {
  const plantId = req.params.id;
  const { state_exchange } = req.body;

  try {
    const result = await plantModel.updatePlantState(plantId, state_exchange);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Plant not found" });
    } else {
      res.json({ message: "Plant state updated", result });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating plant state", error });
  }
};
