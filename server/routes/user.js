const { isAuth, verifyAdmin } = require('../middleware/isAuth');
const userController = require('../controllers/user');

const router = require('express').Router();

// update user profile details
router.put('/:id', isAuth, userController.updateProfile);

// delete user
router.delete('/:id', isAuth, userController.deleteUser);

//get user
router.get('/find/:id', verifyAdmin, userController.getUser);

// get all users
router.get('/find', verifyAdmin, userController.getAllUsers);

// get user stats
router.get('/stats', verifyAdmin, userController.getUserStats);

module.exports = router;