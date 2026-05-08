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
  }
  {
    userId: 2,
    firstName: "Shani",
    lastName: "Levi",
    createDate: new Date(),
    updateDate:  new Date(),
    userRole: "user",
    email:"shani2@gmail.com",
    phone_number:"0558276478",
    password: "Shani123"
  }
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
module.exports = users; //Allows another file to use the users variable