const router = require('express').Router();
const User = require('../models/user');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

// register
router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value) => {
                return User.findOne({ email: value }).then((userDoc) => {
                    if (userDoc) {
                        return Promise.reject('E-mail already in use');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long'),
        body('username').trim().not().isEmpty(),
    ],
    authController.signup
);

// login
router.post('/login', authController.login);

module.exports = router;