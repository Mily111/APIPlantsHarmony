const interactionModel = require("../models/interactionModel");

exports.addInteraction = async (req, res) => {
  const { user_id, plant_id, id_interaction_type, created_at } = req.body;

  console.log("Requête reçue :", req.body); // Ajout d'un journal pour vérifier les données reçues

  if (!user_id || !plant_id || !id_interaction_type || !created_at) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    await interactionModel.addInteraction(
      user_id,
      plant_id,
      id_interaction_type,
      created_at
    );
    res.status(201).json({ message: "Interaction ajoutée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'interaction :", error);
    res.status(500).json({ message: "Erreur de base de données" });
  }
};

exports.getInteractionsForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const interactions = await interactionModel.getInteractionsForUser(userId);
    res.status(200).json(interactions);
  } catch (error) {
    console.error("Erreur lors de la récupération des interactions :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des interactions" });
  }
};

exports.getInteractionTypes = async (req, res) => {
  try {
    const interactionTypes = await interactionModel.getInteractionTypes();
    res.status(200).json(interactionTypes);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des types d'interaction :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des types d'interaction",
    });
  }
};
