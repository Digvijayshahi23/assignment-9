const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', registerVisitor);
router.get('/', protect, authorize('admin', 'security'), getVisitors);

module.exports = router;
