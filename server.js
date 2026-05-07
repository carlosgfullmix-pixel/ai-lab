const express = require("express");
const path = require("path");

const app = express();

// Puerto dinámico (Railway/Render/etc)
const PORT = process.env.PORT || 3000;

// 🔥 IMPORTANTE: servir archivos estáticos
app.use(express.static(__dirname));

// 👇 Esto asegura que al entrar a "/" cargue tu index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// opcional: endpoint de prueba
app.get("/api", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
