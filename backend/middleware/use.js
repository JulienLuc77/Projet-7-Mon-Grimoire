const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("uploads"))
app.get("/", function (req, res) {
  res.send("Hello");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});

module.exports = { app };