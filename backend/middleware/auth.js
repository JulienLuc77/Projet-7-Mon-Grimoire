const express = require("express");
const cors = require("cors");
const app = express();
const jsonwebtoken = require("jsonwebtoken");
require("../app")

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

function checkToken(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (authorization == null) {
    res.status(401).send("Unauthorized");
    return;
  }
  const token = authorization.split(" ")[1];
  console.log("token:", token);
  try {
    const jsonwebtokenSecret = String(process.env.JSONWEBTOKEN_SECRET)
    const result = jsonwebtoken.verify(token, jsonwebtokenSecret);
  console.log("result:", result);
  if (result == null) {
    res.status(401).send("Non autorisé");
    return;
  }
  req.result = result;
  req.tokenPayload = result;
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send("Non autorisé");
  }
  }

module.exports = { app, checkToken };