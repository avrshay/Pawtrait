const users = require("../models/usersMockData");

function register(req, res) {
  const { firstName, lastName, email,phone_number, password } = req.body;
  users.RegisterUser(firstName, lastName, email,phone_number, password);
  res.status(201).json({firstName: firstName,lastName: lastName,error: null});
}

function login(req, res) {
  const { email, password } = req.body;
  const user= users.getUserByEmailAndPassword(email, password);
  if (!user) {
    return res.status(404).json({ error: "Invalid details" });
  }
  res.status(200).json(user);
}
module.exports = { register,login };
