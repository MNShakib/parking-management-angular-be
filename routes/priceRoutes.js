const express = require('express');
const router = express.Router();
const ParkingConfig = require('../models/ParkingConfig');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// GET all prices
router.get('/', async (req, res) => {
  const prices = await ParkingConfig.find();
  res.json(prices);
});

// GET price for specific vehicle type
router.get('/:vehicleType', async (req, res) => {
  const config = await ParkingConfig.findOne({ vehicleType: req.params.vehicleType });
  if (!config) return res.status(404).json({ message: 'Price config not found' });
  res.json(config);
});

// PUT update price per hour for specific vehicle (Admin only)
router.put('/:vehicleType', auth, roleCheck('admin'), async (req, res) => {
  const { pricePerHour } = req.body;
  if (!pricePerHour || typeof pricePerHour !== 'number') {
    return res.status(400).json({ message: 'Invalid price' });
  }

  const updated = await ParkingConfig.findOneAndUpdate(
    { vehicleType: req.params.vehicleType },
    { pricePerHour },
    { new: true, upsert: true }
  );

  res.json({ message: `Price updated for ${req.params.vehicleType}`, updated });
});

module.exports = router;
