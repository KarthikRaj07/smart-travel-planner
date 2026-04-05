const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Agent: Parse user intent from natural language prompt.
 * Extracts: destination, days, budget, preferences.
 */
function parseIntent(prompt) {
  const lower = prompt.toLowerCase();

  // Extract number of days
  const daysMatch = lower.match(/(\d+)[- ]?day/);
  const days = daysMatch ? parseInt(daysMatch[1]) : 3;

  // Extract budget (supports ₹, Rs, INR, $)
  const budgetMatch = lower.match(/(?:₹|rs\.?|inr|\$)\s?(\d[\d,]*)/i);
  const budget = budgetMatch ? budgetMatch[1].replace(/,/g, '') : null;

  // Extract destination (basic heuristic: after "to" or "in" or "visit")
  const destMatch = lower.match(/(?:to|in|visit|trip to|travel to)\s+([a-z\s]+?)(?:\s+for|\s+under|\s+in|\s+with|,|$)/i);
  const destination = destMatch ? destMatch[1].trim() : 'the destination';

  return { destination, days, budget };
}

/**
 * Core Gemini Service: Generate structured travel itinerary.
 * Uses agentic prompt engineering to get JSON-structured response.
 */
async function generateTravelPlan(userPrompt) {
  const { destination, days, budget } = parseIntent(userPrompt);

  const budgetText = budget ? `within a budget of ₹${budget}` : 'with a reasonable budget';

  const systemPrompt = `You are an expert AI travel planner. Generate a detailed, personalized travel itinerary based on the user's request. 
  
You MUST respond with valid JSON only (no markdown, no code blocks, just raw JSON).

The JSON structure must be:
{
  "destination": "City, Country",
  "duration": number_of_days,
  "totalBudgetEstimate": "₹XX,XXX",
  "summary": "Brief engaging summary of the trip",
  "highlights": ["highlight1", "highlight2", "highlight3"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day Title",
      "theme": "Morning Exploration / Adventure / Culture etc",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "description": "Brief description",
          "estimatedCost": "₹XXX",
          "duration": "1-2 hours",
          "tips": "Helpful tip"
        }
      ],
      "meals": {
        "breakfast": { "place": "Restaurant name", "dish": "Recommended dish", "cost": "₹XX" },
        "lunch": { "place": "Restaurant name", "dish": "Recommended dish", "cost": "₹XX" },
        "dinner": { "place": "Restaurant name", "dish": "Recommended dish", "cost": "₹XX" }
      },
      "accommodation": { "name": "Hotel/Hostel name", "type": "Budget/Mid-range/Luxury", "cost": "₹XXX/night", "rating": "4.2/5" },
      "dayCost": "₹X,XXX"
    }
  ],
  "hotels": [
    { "name": "Hotel name", "type": "Budget/Mid-range/Luxury", "pricePerNight": "₹XXX", "rating": "4.2/5", "amenities": ["WiFi", "AC"], "location": "Area name" }
  ],
  "budgetBreakdown": {
    "accommodation": "₹X,XXX",
    "food": "₹X,XXX",
    "activities": "₹X,XXX",
    "transport": "₹X,XXX",
    "miscellaneous": "₹X,XXX",
    "total": "₹XX,XXX"
  },
  "travelTips": ["tip1", "tip2", "tip3"],
  "bestTimeToVisit": "Month range",
  "gettingThere": "Transport options from major cities"
}`;

  const fullPrompt = `${systemPrompt}

User Request: "${userPrompt}"

Generate a complete ${days}-day itinerary for ${destination} ${budgetText}. Be specific with real place names, authentic local restaurants, actual hotels, and accurate cost estimates in Indian Rupees (₹). Make it practical and exciting.`;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    // Parse and validate JSON response
    const plan = JSON.parse(text);
    return { success: true, plan };
  } catch (error) {
    console.error('Gemini API error:', error.message);

    // Retry without JSON mime type if model doesn't support it
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(fullPrompt);
      let text = result.response.text();

      // Strip markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const plan = JSON.parse(text);
      return { success: true, plan };
    } catch (retryError) {
      console.error('Gemini retry error:', retryError.message);
      throw new Error('Failed to generate travel plan. Please try again.');
    }
  }
}

module.exports = { generateTravelPlan, parseIntent };
