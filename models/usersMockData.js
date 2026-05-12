const users = [
  {
    userId: 1,
    firstName: "Dan",
    lastName: "Cohen",
    createDate: new Date(),
    updateDate:  new Date(),
    userRole: "admin",
    email:"dan1@gmail.com",
    phone_number:"0558256478",
    password: "Dan123"
  },
  {
    userId: 2,
    firstName: "Shani",
    lastName: "Levi",
    createDate: new Date(),
    updateDate:  new Date(),
    userRole: "manager",
    email:"shani2@gmail.com",
    phone_number:"0558276478",
    password: "Shani123"
  },
  {
    userId: 3,
    firstName: "gal",
    lastName: "Levi",
    createDate: new Date(),
    updateDate: new Date(),
    userRole: "user",
    email:"gal3@gmail.com",
    phone_number:"0558272478",
    password: "gal123"
  }
];

function getAllUsers(){
  return users.map(user => {const { password, ...safeUser } = user; return safeUser; }); //return all users without password
  }

function geyUserById(id){
  const user = users.find(u => u.userId === Number(id));
  if (!user){
    return null;
  }
  const { password, ...safeUser } = user; //return user without password
  return safeUser;
}

function getUserByEmailAndPassword(email,password){
  const user = users.find(u => u.email === email && u.password === password);
  if (!user){
    return null;
  }
  const { password: _, userId: __, ...safeUser } = user; //return user without password
  return safeUser;
}

function RegisterUser(firstName, lastName, email,phone_number, password){
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
}
function createUser(firstName, lastName, userRole){
  const newUser = {
    userId: users.length+1,
    firstName,
    lastName,
    userRole,
    createDate: new Date(),
    updateDate: new Date(),
    email: "",
    phone_number: "",  
    password: ""
  };
  users.push(newUser);
  return users.length;
}
function updateById(id,firstName, lastName, userRole){
  const user = users.find(u => u.userId === Number(id));
  if (!user) {
    return false;
  }
  user.firstName=firstName;
  user.lastName=lastName;
  user.userRole=userRole;
  user.updateDate = new Date();
  return true
}
function deleteById(id){
  const index = users.findIndex(u => u.userId === Number(id));
  if (index !== -1){
    users.splice(index, 1); //Deleting a user by their index
  }
}

module.exports = {getAllUsers,geyUserById,getUserByEmailAndPassword,RegisterUser,createUser,updateById,deleteById} //Allows another file to use the users variable