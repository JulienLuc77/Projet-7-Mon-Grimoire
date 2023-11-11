const { User } = require("../../backend/models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

async function signUp(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  function hashPassword(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  const user = {
    email: email,
    password: hashPassword(password)
  };
  try {
    await User.create(user);
    res.send("Sign up");
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      res.status(400).send("L'adresse mail est déjà existante");
    } else {
      res.status(500).send("Erreur du serveur");
    }
  }
}
async function loginUser(req, res){
  const body = req.body;
  
  const userDb = await User.findOne({
    email: body.email
  });
  if (userDb == null) {
    res.status(401).send("Erreur de saisie");
    return;
  }
  function isPasswordValid(password, hash) {
    const isValid = bcrypt.compareSync(password, hash);
    return isValid;
  }
  const passwordDb = userDb.password;
  if (!isPasswordValid(req.body.password, passwordDb)) {
    res.status(401).send("Erreur de saisie");
    return;
  }
  res.send({
    userId: userDb._id,
    token: createToken(userDb._id)
  });
}
function createToken(idDb) {
  const payload = {
    userId: idDb
  }
  const jsonwebtokenSecret = String(process.env.JSONWEBTOKEN_SECRET);
  const token = jsonwebtoken.sign(payload, jsonwebtokenSecret,{
    expiresIn: "1h"
  });
  return token;
}

module.exports = { signUp, loginUser };