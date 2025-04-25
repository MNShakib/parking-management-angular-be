const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

exports.register = async (req, res) => {
  const { username, password, bikeNumber, carNumber } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
    bikeNumber: bikeNumber || null,
    carNumber: carNumber || null
  });

  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
};


exports.updateVehicleNumbers = async (req, res) => {
  const { bikeNumber, carNumber } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (bikeNumber !== undefined) user.bikeNumber = bikeNumber;
    if (carNumber !== undefined) user.carNumber = carNumber;

    await user.save();
    res.status(200).json({ message: 'Vehicle numbers updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username: ADMIN_USERNAME, role: 'admin' }, process.env.JWT_SECRET);
    return res.json({ token });
  }
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { id: user._id, role: user.role, username: user.username }, // ✅ include username
    process.env.JWT_SECRET
  );
  
  res.json({ token });
};
