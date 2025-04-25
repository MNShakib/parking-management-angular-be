const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { updateVehicleNumbers } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // your JWT middleware

router.post('/register', register);
router.post('/login', login);

router.put('/update-vehicle-numbers', authMiddleware, updateVehicleNumbers);

module.exports = router;
