const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllBikeSlots, getAllCarSlots, bookBikeSlot, bookCarSlot, exitBikeBooking, exitCarBooking } = require('../controllers/userController');

router.get('/bike', auth, getAllBikeSlots);
router.get('/car', auth, getAllCarSlots);
router.put('/book-bike-slot/:slotId', auth, bookBikeSlot);
router.put('/book-car-slot/:slotId', auth, bookCarSlot);
router.put('/exit-bike-slot/:slotId', auth, exitBikeBooking);
router.put('/exit-car-slot/:slotId', auth, exitCarBooking);

module.exports = router;