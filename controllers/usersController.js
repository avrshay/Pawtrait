const users = require("../models/usersMockData");

function getAll(req, res) {
  const allUsers=users.getAllUsers();
  res.status(200).json(allUsers);
}

function getById(req, res) {
  const id= req.params.id;
  const user= users.geyUserById(id);
  if (!user) {
     return res.status(404).json({ error: "user not found" });
  }
  res.json(user);
}
function newUser(req, res) {
  const { firstName, lastName, userRole } = req.body;
  const id=users.createUser(firstName, lastName, userRole);
  res.status(201).json({userId: id});
}
function updateUser(req, res) {
  const id= req.params.id;
  const { firstName, lastName,userRole } = req.body;
  const isSuccess= users.updateById(id,firstName, lastName, userRole);
  res.status(200).json({userId: id});
}
function deleteUser(req, res) {
  const id = req.params.id;
  users.deleteById(id);
  res.status(200).json({userId: id});
}

module.exports = {getAll,getById,newUser,updateUser,deleteUser };