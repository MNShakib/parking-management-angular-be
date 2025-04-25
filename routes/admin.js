const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createBikeSlot, createCarSlot, deleteSlot } = require('../controllers/adminController');

router.post('/bike', auth, roleCheck('admin'), createBikeSlot);
router.post('/car', auth, roleCheck('admin'), createCarSlot);

module.exports = router;
