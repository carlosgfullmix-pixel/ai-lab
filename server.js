const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// permitir JSON
app.use(express.json());

// ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor OK 🚀");
});

// acá conectamos tu lógica después
// app.use("/api", require("./routes"));

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});