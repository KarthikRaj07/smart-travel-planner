const { getDb } = require('../config/firebase');

/**
 * GET /api/trips
 * Fetch all trips for the authenticated user
 */
const getTrips = async (req, res) => {
  const userId = req.user.uid;

  try {
    const db = getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not initialized. Please configure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env' });
    }
    // NOTE: Avoid orderBy + where combo — requires a composite Firestore index.
    // Instead, fetch with just where() and sort in-memory.
    const snapshot = await db
      .collection('trips')
      .where('userId', '==', userId)
      .get();

    const trips = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        // Sort descending by createdAt (newest first)
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

    return res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error('getTrips error:', error.message, error.code);
    return res.status(500).json({ error: 'Failed to fetch trips. ' + error.message });
  }
};

/**
 * POST /api/trips
 * Save a trip for the authenticated user
 * Body: { plan: object, prompt: string }
 */
const saveTrip = async (req, res) => {
  const userId = req.user.uid;
  const { plan, prompt } = req.body;

  if (!plan || !plan.destination) {
    return res.status(400).json({ error: 'Invalid trip data.' });
  }

  try {
    const db = getDb();
    if (!db) {
      return res.status(503).json({ error: 'Database not initialized. Please configure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env' });
    }
    const tripData = {
      userId,
      prompt: prompt || '',
      destination: plan.destination,
      duration: plan.duration,
      totalBudgetEstimate: plan.totalBudgetEstimate,
      summary: plan.summary,
      highlights: plan.highlights || [],
      plan,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('trips').add(tripData);
    return res.status(201).json({ success: true, tripId: docRef.id, trip: tripData });
  } catch (error) {
    console.error('saveTrip error:', error.message);
    return res.status(500).json({ error: 'Failed to save trip.' });
  }
};

/**
 * DELETE /api/trips/:id
 * Delete a trip by ID (only if it belongs to the user)
 */
const deleteTrip = async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  try {
    const db = getDb();
    const doc = await db.collection('trips').doc(id).get();

    if (!doc.exists || doc.data().userId !== userId) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    await db.collection('trips').doc(id).delete();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('deleteTrip error:', error.message);
    return res.status(500).json({ error: 'Failed to delete trip.' });
  }
};

module.exports = { getTrips, saveTrip, deleteTrip };
