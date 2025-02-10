const Router = require('express').Router;
const UserController = require('../controllers/userController');
const router = Router();

router.get('/', UserController.getUsers);


module.exports = router;