const express = require('express');
const router = express.Router();

const User = require('../models/User');

const { register, login } = require('../controllers/authController');
const { updateVehicleNumbers } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // your JWT middleware

router.post('/register', register);
router.post('/login', login);

router.put('/update-vehicle-numbers', authMiddleware, updateVehicleNumbers);

router.get('/current', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      console.error('Fetch current user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;
