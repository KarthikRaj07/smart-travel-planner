import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 transition-all text-left"
      >
        <span className="text-white font-medium text-sm">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-gray-400 text-sm">▼</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ItineraryDisplay({ plan, onSave, saving, saved }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = JSON.stringify(plan, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-4"
    >
      {/* Header card */}
      <div className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/30 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-white text-xl font-bold">{plan.destination}</h2>
            <p className="text-gray-300 text-sm mt-1">{plan.summary}</p>
            <div className="flex gap-3 mt-3 flex-wrap">
              <Chip icon="📅" text={`${plan.duration} Days`} color="violet" />
              <Chip icon="💰" text={plan.totalBudgetEstimate} color="emerald" />
              <Chip icon="🕐" text={plan.bestTimeToVisit || 'Year round'} color="amber" />
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl transition-all flex items-center gap-1.5"
            >
              {copied ? '✅ Copied' : '📋 Copy'}
            </button>
            {!saved && (
              <button
                onClick={onSave}
                disabled={saving}
                className="px-4 py-2 text-xs bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-60"
              >
                {saving ? (
                  <><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : '💾 Save Trip'}
              </button>
            )}
            {saved && (
              <span className="px-4 py-2 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl">
                ✅ Saved
              </span>
            )}
          </div>
        </div>

        {/* Highlights */}
        {plan.highlights?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {plan.highlights.map((h, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full">⭐ {h}</span>
            ))}
          </div>
        )}
      </div>

      {/* Day-wise itinerary */}
      <Section title={`🗓️ Day-wise Itinerary (${plan.itinerary?.length} days)`}>
        <div className="space-y-4">
          {plan.itinerary?.map((day) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: day.day * 0.05 }}
              className="bg-white/4 border border-white/8 rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {day.day}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{day.title}</h4>
                  <p className="text-violet-300 text-xs">{day.theme}</p>
                </div>
                <span className="ml-auto text-emerald-300 text-xs font-medium">{day.dayCost}</span>
              </div>

              {/* Activities */}
              <div className="space-y-2 mb-3">
                {day.activities?.map((act, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white/4 rounded-xl">
                    <div className="text-violet-300 text-xs font-medium w-16 flex-shrink-0 pt-0.5">{act.time}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium">{act.activity}</p>
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{act.description}</p>
                      {act.tips && <p className="text-amber-400/80 text-xs mt-1">💡 {act.tips}</p>}
                    </div>
                    <div className="text-emerald-300 text-xs flex-shrink-0">{act.estimatedCost}</div>
                  </div>
                ))}
              </div>

              {/* Meals */}
              {day.meals && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    day.meals[meal] && (
                      <div key={meal} className="bg-white/4 rounded-xl p-2.5">
                        <p className="text-gray-500 text-xs capitalize mb-1">{meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {meal}</p>
                        <p className="text-white text-xs font-medium line-clamp-1">{day.meals[meal].place}</p>
                        <p className="text-gray-400 text-xs line-clamp-1">{day.meals[meal].dish}</p>
                        <p className="text-emerald-300 text-xs">{day.meals[meal].cost}</p>
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Accommodation */}
              {day.accommodation && (
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-blue-300 text-xs">🏨 Stay: <span className="text-white font-medium">{day.accommodation.name}</span> · {day.accommodation.cost} · ⭐ {day.accommodation.rating}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Budget breakdown */}
      {plan.budgetBreakdown && (
        <Section title="💰 Budget Breakdown">
          <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
            {Object.entries(plan.budgetBreakdown).map(([key, val], i, arr) => {
              const isTotal = key === 'total';
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-2.5 ${
                    isTotal
                      ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-t border-violet-500/30'
                      : i < arr.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <span className={`text-sm ${isTotal ? 'text-white font-bold' : 'text-gray-400'} capitalize`}>
                    {isTotal ? '🏁 Total' : key}
                  </span>
                  <span className={`text-sm font-semibold ${isTotal ? 'text-emerald-300' : 'text-white'}`}>{val}</span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Hotels */}
      {plan.hotels?.length > 0 && (
        <Section title="🏨 Recommended Hotels" defaultOpen={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.hotels.map((hotel, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">{hotel.name}</p>
                  <span className="text-yellow-400 text-xs">⭐ {hotel.rating}</span>
                </div>
                <p className="text-gray-400 text-xs">{hotel.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    hotel.type === 'Budget' ? 'bg-blue-500/15 text-blue-300' :
                    hotel.type === 'Luxury' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-purple-500/15 text-purple-300'
                  }`}>{hotel.type}</span>
                  <span className="text-emerald-300 text-xs">{hotel.pricePerNight}/night</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Travel Tips */}
      {plan.travelTips?.length > 0 && (
        <Section title="💡 Travel Tips" defaultOpen={false}>
          <ul className="space-y-2">
            {plan.travelTips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-gray-300 text-sm">
                <span className="text-violet-400 flex-shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Getting There */}
      {plan.gettingThere && (
        <Section title="🚗 Getting There" defaultOpen={false}>
          <p className="text-gray-300 text-sm leading-relaxed">{plan.gettingThere}</p>
        </Section>
      )}
    </motion.div>
  );
}

function Chip({ icon, text, color }) {
  const colors = {
    violet: 'bg-violet-500/15 text-violet-300',
    emerald: 'bg-emerald-500/15 text-emerald-300',
    amber: 'bg-amber-500/15 text-amber-300',
  };
  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {icon} {text}
    </span>
  );
}
