const db = require("../config/db");

const getAllPlants = async () => {
  const [plants] = await db.query(`
    SELECT gp.id_plant, gp.name_plant, pt.plant_type_name, st.label_soil_type, ah.label AS humidity_level, l.label AS light_level
    FROM generic_plants gp
    JOIN plants_type pt ON gp.Id_plants_type = pt.Id_plants_type
    JOIN plants_type_soil_need ptsn ON gp.Id_plants_type = ptsn.Id_plants_type
    JOIN soil_type st ON ptsn.Id_soil_type = st.Id_soil_type
    JOIN plants_atmospheric_humidity_need pahn ON gp.Id_plants_type = pahn.Id_plants_type
    JOIN atmospheric_humidity ah ON pahn.Id_atmospheric_humidity = ah.Id_atmospheric_humidity
    JOIN plants_light_level_needs plln ON gp.Id_plants_type = plln.Id_plants_type
    JOIN level l ON plln.Id_level = l.Id_level
  `);
  return plants;
};

module.exports = {
  getAllPlants,
};
