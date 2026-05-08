const users = require("../models/usersMockData");

function register(req, res) {
  const { firstName, lastName, email,phone_number, password } = req.body;

  const newUser = {
    userId: users.length+1,
    firstName,
    lastName,
    userRole: "user",
    createDate: new Date(),
    updateDate: new Date(),
    email,
    phone_number,
    password,
  };
  users.push(newUser);
  res.status(201).json({userId: user.userId,firstName: user.firstName,lastName: user.lastName,error: null});

}

function login(req, res) {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(404).json({ error: "Invalid credentials" });
  }

  res.status(200).json({userId: user.userId,firstName: user.firstName,lastName: user.lastName,error: null});
}
module.exports = { register };
module.exports = { login };
