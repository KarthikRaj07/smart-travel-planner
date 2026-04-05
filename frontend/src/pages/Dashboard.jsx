import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { getTrips, deleteTrip } from '../services/tripService';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  async function fetchTrips() {
    try {
      setLoading(true);
      const data = await getTrips();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(tripId) {
    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch {
      alert('Failed to delete trip.');
    }
  }

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="text-gray-400 mt-1">
                {trips.length > 0
                  ? `You have ${trips.length} saved trip${trips.length > 1 ? 's' : ''}.`
                  : "Ready to plan your next adventure?"}
              </p>
            </div>
            <Link
              to="/planner"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 text-sm"
            >
              ✨ Plan New Trip
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Trips Planned', value: trips.length, icon: '✈️' },
              { label: 'Countries', value: new Set(trips.map((t) => t.destination?.split(',').pop()?.trim())).size || 0, icon: '🌍' },
              { label: 'Days Planned', value: trips.reduce((acc, t) => acc + (t.duration || 0), 0), icon: '📅' },
              { label: 'AI Conversations', value: trips.length, icon: '💬' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/4 border border-white/8 rounded-2xl p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-white text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trip grid */}
        {loading ? (
          <LoadingSpinner text="Loading your trips..." />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchTrips} className="mt-4 text-violet-400 underline text-sm">Try again</button>
          </div>
        ) : trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/3 border border-white/8 rounded-3xl"
          >
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl font-semibold text-white mb-2">No trips yet</h2>
            <p className="text-gray-400 text-sm mb-6">Start planning your first adventure with AI!</p>
            <Link
              to="/planner"
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              Plan My First Trip ✈️
            </Link>
          </motion.div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-white mb-4">Your Saved Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onView={setSelectedTrip}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Trip detail modal */}
      {selectedTrip && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedTrip(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">{selectedTrip.destination}</h2>
              <button onClick={() => setSelectedTrip(null)} className="text-gray-500 hover:text-white p-1">✕</button>
            </div>
            <p className="text-gray-400 text-sm mb-4">{selectedTrip.summary}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-violet-500/15 text-violet-300 text-xs rounded-full">📅 {selectedTrip.duration} days</span>
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 text-xs rounded-full">💰 {selectedTrip.totalBudgetEstimate}</span>
            </div>
            {selectedTrip.highlights?.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-xs uppercase font-semibold mb-2">Highlights</h3>
                <ul className="space-y-1">
                  {selectedTrip.highlights.map((h, i) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2"><span className="text-violet-400">⭐</span>{h}</li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              to="/planner"
              className="mt-6 block text-center py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl"
            >
              Plan a New Trip →
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
