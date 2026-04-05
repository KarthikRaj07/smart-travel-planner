const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { planTravel } = require('../controllers/travelController');

// POST /api/travel/plan - Generate AI travel plan
router.post('/plan', authMiddleware, planTravel);

module.exports = router;
