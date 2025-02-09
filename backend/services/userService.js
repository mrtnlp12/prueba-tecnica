const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find({}).select({ name: 1, email: 1, _id: 1 });
  return users
}

const getUserByEmail = async (email) => {
  const user = await User.findOne({
    email
  })
  return user
}

const registerUser = async (name, email, password) => {
  const user = new User({
    name,
    email,
    password
  });
  await user.save();
}

module.exports = {
  getUsers,
  registerUser,
  getUserByEmail
}