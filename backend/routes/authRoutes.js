const Router = require('express').Router;
const { body } = require('express-validator');

const { validateRequest } = require('../middlewares/validator');
const AuthController = require('../controllers/authController');
const router = Router();


router.get('/verify', AuthController.checkAuth);

router.post('/login',[
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
  validateRequest()
], AuthController.login);

router.post('/signup', [
  body('name').isLength({min: 2}).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
  validateRequest()
], AuthController.register);



module.exports = router; 