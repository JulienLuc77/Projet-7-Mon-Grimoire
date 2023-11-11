require("dotenv").config();
const mongoose = require('mongoose');

const DB_URL = `mongodb+srv://${process.env.userDb}:${process.env.Password}@${process.env.DB_CLUSTER}`;
console.log("DB_URL:", DB_URL);
async function connect() {;
  try {
  await mongoose.connect(DB_URL);
  console.log("Connexion à MongoDB réussie !");
  } catch (e) {
  console.error(e);
  }
}
connect();
