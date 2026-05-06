const express = require("express");

const app = express();

const PORT = process.env.PORT;

// IMPORTANTE: Railway necesita este bind explícito
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});

// ruta obligatoria
app.get("/", (req, res) => {
  res.status(200).send("Servidor OK 🚀");
});
