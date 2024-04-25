const app = require("./server"); // S'assurer que le chemin est correct et pointe vers votre fichier de configuration du serveur
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
