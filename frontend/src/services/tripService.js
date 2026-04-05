import axios from 'axios';
import { auth } from '../firebase';

// Get Firebase ID token for current user
async function getAuthToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

// Generate AI travel plan
export async function generatePlan(prompt) {
  const token = await getAuthToken();
  const { data } = await axios.post(
    '/api/travel/plan',
    { prompt },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data.plan;
}

// Save a trip to backend/Firestore
export async function saveTrip(plan, prompt) {
  const token = await getAuthToken();
  const { data } = await axios.post(
    '/api/trips',
    { plan, prompt },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

// Get all saved trips for the authenticated user
export async function getTrips() {
  const token = await getAuthToken();
  const { data } = await axios.get('/api/trips', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.trips;
}

// Delete a trip
export async function deleteTrip(tripId) {
  const token = await getAuthToken();
  await axios.delete(`/api/trips/${tripId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
