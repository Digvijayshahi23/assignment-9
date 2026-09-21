const express = require('express');
const router = express.Router();
const { issuePass, getPasses, scanPass, getCheckLogs } = require('../controllers/passController');
const { protect, authorize } = require('../middleware/auth');

router.post('/issue', protect, authorize('admin', 'security'), issuePass);
router.get('/', protect, authorize('admin', 'security'), getPasses);
router.post('/scan', protect, authorize('security', 'admin'), scanPass);
router.get('/logs', protect, authorize('admin', 'security'), getCheckLogs);

module.exports = router;
