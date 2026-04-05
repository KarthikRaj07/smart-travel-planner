import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TripCard({ trip, onView, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this trip?')) return;
    setDeleting(true);
    await onDelete(trip.id);
  };

  const date = trip.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-violet-500/50 hover:bg-white/8 transition-all duration-300"
      onClick={() => onView(trip)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-lg flex-shrink-0">
            ✈️
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1">
              {trip.destination}
            </h3>
            <p className="text-gray-500 text-xs">{date}</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
          title="Delete trip"
        >
          {deleting ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Summary */}
      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
        {trip.summary || 'No summary available'}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2 py-0.5 bg-violet-500/15 text-violet-300 text-xs rounded-full">
          {trip.duration} days
        </span>
        <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 text-xs rounded-full">
          {trip.totalBudgetEstimate}
        </span>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}
