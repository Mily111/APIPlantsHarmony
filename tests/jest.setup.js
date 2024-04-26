const db = require("../config/db"); // Assurez-vous que le chemin est correct, il peut être nécessaire de modifier le chemin relatif

// Fonctions globales existantes
global.resetTestData = async () => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.query("DELETE FROM users WHERE username LIKE 'testuser%'");
  } catch (error) {
    console.error("Failed to reset test data:", error);
  } finally {
    if (connection) connection.release();
  }
};

global.clearTestData = async () => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.query("DELETE FROM users WHERE username LIKE 'testuser%'");
  } catch (error) {
    console.error("Failed to clear test data:", error);
  } finally {
    if (connection) connection.release();
  }
};

// Utilisation de afterEach pour appliquer la réinitialisation après chaque test
// afterEach(async () => {
//   await global.resetTestData(); // Utilisation de la fonction globale déjà définie
// });
afterAll(async () => {
  await db.end(); // Assurez-vous que votre module de base de données exporte une fonction `end` qui ferme toutes les connexions du pool.
});
