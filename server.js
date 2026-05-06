const express = require("express");

const app = express();

// IMPORTANTE: Railway necesita esto
const PORT = process.env.PORT || 3000;

// rutas
app.get("/", (req, res) => {
  res.status(200).send("Servidor OK 🚀");
});

// IMPORTANTE: escuchar en 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log("Running on port " + PORT);
});
