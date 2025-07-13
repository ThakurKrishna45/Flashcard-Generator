const { signup, login } = require('../Controller/authController');
const { signupValidation, loginValidation } = require('../Middleware/AuthValidation');

const router= require('express').Router();

router.post('/registration',signupValidation,signup)
router.post('/login',loginValidation,login)

module.exports= router;