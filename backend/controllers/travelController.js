const { generateTravelPlan } = require('../services/geminiService');
const { getDb } = require('../config/firebase');

/**
 * POST /api/travel/plan
 * Generate AI travel plan using Gemini
 * Body: { prompt: string }
 */
const planTravel = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user?.uid;

  if (!prompt || prompt.trim().length < 5) {
    return res.status(400).json({ error: 'Please provide a valid travel prompt.' });
  }

  console.log(`🤖 Generating plan for user ${userId}: "${prompt}"`);

  const { success, plan } = await generateTravelPlan(prompt);

  if (!success) {
    return res.status(500).json({ error: 'Failed to generate travel plan.' });
  }

  // Optionally store chat history
  try {
    const db = getDb();
    if (db) {
      await db.collection('chat_history').add({
        userId,
        prompt,
        response: plan,
        createdAt: new Date().toISOString(),
      });
    } else {
      console.warn('⚠️ Firestore not initialized, skipping chat history save.');
    }
  } catch (dbError) {
    console.warn('Could not save chat history:', dbError.message);
  }

  return res.status(200).json({ success: true, plan });
};

module.exports = { planTravel };
