
const Bike = require('../models/Bike');
const Car = require('../models/Car');

exports.createBikeSlot = async (req, res) => {
  try {
    const { numberOfSlots } = req.body;

    if (!numberOfSlots || numberOfSlots <= 0) {
      return res.status(400).json({ message: 'Invalid data. Number of slots are required.' });
    }

    const existingSlots = await Bike.find().sort({ number: 1 });
    const currentCount = existingSlots.length;

    if (numberOfSlots > currentCount) {
      const slotsToAdd = numberOfSlots - currentCount;
      const lastNumber = currentCount > 0 ? existingSlots[existingSlots.length - 1].number : 0;

      const newSlots = [];
      for (let i = 1; i <= slotsToAdd; i++) {
        newSlots.push({
          number: lastNumber + i,
          isBooked: false,
          bookedBy: null
        });
      }

      const createdSlots = await Bike.insertMany(newSlots);
      return res.status(201).json({
        message: `${createdSlots.length} new bike parking slots added.`,
        createdSlots
      });

    } else if (numberOfSlots < currentCount) {
      const slotsToRemoveCount = currentCount - numberOfSlots;
      const slotsToRemove = existingSlots.slice(-slotsToRemoveCount);
      const bookedSlots = slotsToRemove.filter(slot => slot.isBooked);

      if (bookedSlots.length > 0) {
        return res.status(400).json({
          message: 'Some slots to be deleted are already booked by users.',
          bookedSlots
        });
      }

      const idsToRemove = slotsToRemove.map(slot => slot._id);
      await Bike.deleteMany({ _id: { $in: idsToRemove } });

      return res.status(200).json({
        message: `${slotsToRemoveCount} bike parking slots removed.`,
        removedSlotNumbers: slotsToRemove.map(slot => slot.number)
      });

    } else {
      return res.status(200).json({
        message: `No changes. Already have ${numberOfSlots} bike parking slots.`
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createCarSlot = async (req, res) => {
  try {
    const { numberOfSlots } = req.body;

    if (!numberOfSlots || numberOfSlots <= 0) {
      return res.status(400).json({ message: 'Invalid data. Number of slots are required.' });
    }

    const existingSlots = await Car.find().sort({ number: 1 });
    const currentCount = existingSlots.length;

    if (numberOfSlots > currentCount) {
      const slotsToAdd = numberOfSlots - currentCount;
      const lastNumber = currentCount > 0 ? existingSlots[existingSlots.length - 1].number : 0;

      const newSlots = [];
      for (let i = 1; i <= slotsToAdd; i++) {
        newSlots.push({
          number: lastNumber + i,
          isBooked: false,
          bookedBy: null
        });
      }

      const createdSlots = await Car.insertMany(newSlots);
      return res.status(201).json({
        message: `${createdSlots.length} new car parking slots added.`,
        createdSlots
      });

    } else if (numberOfSlots < currentCount) {
      const slotsToRemoveCount = currentCount - numberOfSlots;
      const slotsToRemove = existingSlots.slice(-slotsToRemoveCount);
      const bookedSlots = slotsToRemove.filter(slot => slot.isBooked);

      if (bookedSlots.length > 0) {
        return res.status(400).json({
          message: 'Some slots to be deleted are already booked by users.',
          bookedSlots
        });
      }

      const idsToRemove = slotsToRemove.map(slot => slot._id);
      await Car.deleteMany({ _id: { $in: idsToRemove } });

      return res.status(200).json({
        message: `${slotsToRemoveCount} car parking slots removed.`,
        removedSlotNumbers: slotsToRemove.map(slot => slot.number)
      });

    } else {
      return res.status(200).json({
        message: `No changes. Already have ${numberOfSlots} car parking slots.`
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
