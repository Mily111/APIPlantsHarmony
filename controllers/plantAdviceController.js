const plantAdviceModel = require("../models/plantAdviceModel");

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await plantAdviceModel.getAllPlants();
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants data:", error);
    res.status(500).json({ error: "Failed to fetch plants data" });
  }
};
