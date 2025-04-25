const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bikeNumber: { type: String, default: null },  // ✅ optional
  carNumber: { type: String, default: null }    // ✅ optional
});

module.exports = mongoose.model('User', userSchema);
