const { isAuth, verifyAdmin } = require('../middleware/isAuth');
const router = require('express').Router();

// create product
router.post('/', verifyAdmin);

module.exports = router;