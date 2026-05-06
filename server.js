const express = require("express");

const app = express();

// IMPORTANTE: fallback de puerto
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Servidor OK 🚀");
});

// IMPORTANTE: bind correcto
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
