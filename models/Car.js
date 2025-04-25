const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  number: Number,
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bookedByName: { type: String, default: null },
  vehicleNumber: { type: String, default: null },
  bookedAt: { type: Date, default: null }
});

module.exports = mongoose.model('car', carSchema);