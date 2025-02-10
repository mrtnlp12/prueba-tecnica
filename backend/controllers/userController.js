const UserService = require("../services/userService");

const getUsers = async (req, res) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);  
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getUsers
}