const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  vehicleType: { type: String, enum: ['car', 'bike'], required: true, unique: true },
  pricePerHour: { type: Number, required: true }
});

module.exports = mongoose.model('ParkingConfig', configSchema);
