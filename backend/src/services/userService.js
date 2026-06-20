const { User } = require("../../models");
//functions of user

// The frontend expects the primary key as "userId" (set when this project still used
// mock data), but the Sequelize model's column is "id" — translate at the boundary.
function toUserDTO(user) {
  if (!user) return user;
  const { id, ...rest } = user.toJSON();
  return { userId: id, ...rest };
}

//get all users
async function getAllUsers() {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  return users.map(toUserDTO);
}

//get User By Id
async function getUserById(id) {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  return toUserDTO(user);
}

// get User By Email And Password
async function getUserByEmailAndPassword(email, password) {
  const user = await User.findOne({
    where: { email, password },
    attributes: { exclude: ["password"] },
  });
  return toUserDTO(user);
}

//Register User
async function RegisterUser(data) {
  const existingUser = await User.findOne({where: { email: data.email },}); // not impossible some users wuth the same email
  if (existingUser) {
    return null;
  }
  const newUser = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    userRole: "user",
    email: data.email,
    phone_number: data.phone_number,
    password: data.password,
  });
  return toUserDTO(newUser);
}

//create User
async function createUser(data) {
    const existingUser = await User.findOne({where: { email: data.email },}); // not impossible some users wuth the same email
    if (existingUser) {
        return null; 
    }
  const newUser = await User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    userRole: data.userRole,
    email:  data.email || "",
    phone_number: data.phone_number||"",
    password: "example123",
  });
  return newUser.id;
}

// update user By Id
async function updateById(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone_number: data.phone_number,
    userRole: data.userRole,
  });
  return true;
}

// update Details user By user
async function updateDetailsById(id, data) {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone_number: data.phone_number,
  });
  return true;
}

async function deleteById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    return false;
  }
  await  User.destroy({ where: { id } });
  return true;
}

module.exports = {getAllUsers,getUserById,getUserByEmailAndPassword,RegisterUser,createUser,updateById,deleteById,updateDetailsById} //Allows another file to use the users variable