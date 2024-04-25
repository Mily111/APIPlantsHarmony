const db = require("../config/db");

exports.getAllPlants = (req, res) => {
  db.query("SELECT * FROM generic_plants", (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving plants from database");
    } else {
      res.status(200).json(results);
    }
  });
};

exports.createPlant = (req, res) => {
  // Add logic to create a plant
};

exports.getPlantById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM generic_plants WHERE Id_plant = ?",
    [id],
    (err, results) => {
      if (err) {
        res
          .status(500)
          .json({ message: "Error fetching plant from database", error: err });
      } else if (results.length === 0) {
        res.status(404).json({ message: "Plant not found" });
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
};

exports.updatePlant = (req, res) => {
  // Add logic to update a plant
};

exports.deletePlant = (req, res) => {
  // Add logic to delete a plant
};
