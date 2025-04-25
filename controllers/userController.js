const Bike = require('../models/Bike');
const Car = require('../models/Car');
const User = require('../models/User');

// 🛵 Get all bike slots
exports.getAllBikeSlots = async (req, res) => {
  const slots = await Bike.find();
  res.json(slots);
};

// 🚗 Get all car slots
exports.getAllCarSlots = async (req, res) => {
  const slots = await Car.find();
  res.json(slots);
};

// 🛵 Book a bike slot
exports.bookBikeSlot = async (req, res) => {
  const slot = await Bike.findById(req.params.slotId);
  let { vehicleNumber } = req.body;

  if (!slot || slot.isBooked)
    return res.status(400).json({ message: 'Slot not available' });

  // Normalize the vehicle number to uppercase
  vehicleNumber = vehicleNumber.toUpperCase();

  // Check if the vehicle is already booked in a car slot (case-insensitive)
  const duplicateInCars = await Car.findOne({
    isBooked: true,
    vehicleNumber: { $regex: `^${vehicleNumber}$`, $options: 'i' }
  });

  // Check if the vehicle is already booked in another bike slot (case-insensitive)
  const duplicateInBikes = await Bike.findOne({
    isBooked: true,
    vehicleNumber: { $regex: `^${vehicleNumber}$`, $options: 'i' }
  });

  if (duplicateInCars || duplicateInBikes) {
    return res.status(409).json({ message: 'This vehicle number is already booked in another slot.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Proceed with booking
  slot.isBooked = true;
  slot.bookedBy = user._id;
  slot.bookedByName = user.username; // or use user.name if that's in your schema
  slot.bookedAt = new Date();
  slot.vehicleNumber = vehicleNumber;

  await slot.save();

  res.status(200).json({ message: 'Bike slot booked successfully' });
};

// 🚗 Book a car slot
exports.bookCarSlot = async (req, res) => {
  const slot = await Car.findById(req.params.slotId);
  let { vehicleNumber } = req.body;

  if (!slot || slot.isBooked)
    return res.status(400).json({ message: 'Slot not available' });

  // Normalize vehicle number to uppercase for consistency
  vehicleNumber = vehicleNumber.toUpperCase();

  // Check for duplicate vehicle number in car slots
  const duplicateInCars = await Car.findOne({
    isBooked: true,
    vehicleNumber: { $regex: `^${vehicleNumber}$`, $options: 'i' }
  });

  // Check for duplicate vehicle number in bike slots
  const duplicateInBikes = await Bike.findOne({
    isBooked: true,
    vehicleNumber: { $regex: `^${vehicleNumber}$`, $options: 'i' }
  });

  if (duplicateInCars || duplicateInBikes) {
    return res.status(409).json({ message: 'This vehicle number is already booked in another slot.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  slot.isBooked = true;
  slot.bookedBy = user._id;
  slot.bookedByName = user.username; // use user.name if you renamed it
  slot.bookedAt = new Date();
  slot.vehicleNumber = vehicleNumber;
  await slot.save();

  res.status(200).json({ message: 'Car slot booked successfully' });
};

// 🛵 Exit bike booking
exports.exitBikeBooking = async (req, res) => {
  try {
    const slot = await Bike.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: 'Bike slot not found' });

    if (!slot.isBooked)
      return res.status(400).json({ message: 'Slot is not currently booked' });

    if (String(slot.bookedBy) !== req.user.id)
      return res.status(403).json({ message: 'You are not authorized to release this slot' });

    slot.isBooked = false;
    slot.bookedBy = null;
    slot.bookedByName = null;
    slot.bookedAt = null;
    slot.vehicleNumber = null;
    await slot.save();

    res.status(200).json({ message: 'Bike slot released successfully' });
  } catch (err) {
    console.error('Exit bike booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🚗 Exit car booking
exports.exitCarBooking = async (req, res) => {
  try {
    const slot = await Car.findById(req.params.slotId);
    if (!slot) return res.status(404).json({ message: 'Car slot not found' });

    if (!slot.isBooked)
      return res.status(400).json({ message: 'Slot is not currently booked' });

    if (String(slot.bookedBy) !== req.user.id)
      return res.status(403).json({ message: 'You are not authorized to release this slot' });

    slot.isBooked = false;
    slot.bookedBy = null;
    slot.bookedByName = null;
    slot.bookedAt = null;
    slot.vehicleNumber = null;
    await slot.save();

    res.status(200).json({ message: 'Car slot released successfully' });
  } catch (err) {
    console.error('Exit car booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
