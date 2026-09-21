const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
