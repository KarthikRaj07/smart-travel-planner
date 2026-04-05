const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTrips, saveTrip, deleteTrip } = require('../controllers/tripsController');

// GET /api/trips - Fetch all trips for authenticated user
router.get('/', authMiddleware, getTrips);

// POST /api/trips - Save a trip
router.post('/', authMiddleware, saveTrip);

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', authMiddleware, deleteTrip);

module.exports = router;
