import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const features = [
  { icon: '🤖', title: 'AI-Powered Planning', desc: 'Gemini AI generates complete day-wise itineraries tailored to your budget and preferences.' },
  { icon: '🗺️', title: 'Smart Agentic System', desc: 'Auto-parses your prompt to understand destination, duration, and budget — no form filling.' },
  { icon: '💬', title: 'Chat Interface', desc: 'Plan trips conversationally, just like texting a travel expert friend.' },
  { icon: '🎙️', title: 'Voice Input', desc: 'Speak your trip idea and let AI handle the rest — truly hands-free planning.' },
  { icon: '📊', title: 'Budget Breakdown', desc: 'Get detailed cost estimates for accommodation, food, activities & transport.' },
  { icon: '💾', title: 'Save & Revisit', desc: 'Save all your plans to your personal dashboard and access them anytime.' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-300 text-sm mb-6"
          >
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Powered by Google Gemini AI
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Plan Your{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Perfect Trip
            </span>
            <br />
            with AI
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Tell our AI where you want to go and your budget. Get a complete day-by-day
            itinerary with hotels, food, activities, and costs — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 text-sm"
            >
              Start Planning for Free →
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-2xl transition-all text-sm"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Demo prompt bubble */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative max-w-2xl mx-auto mt-16"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-gray-500 text-xs ml-2">AI Travel Planner</span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs">👤</div>
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-xs">
                Plan a 3-day trip to Ooty under ₹10,000
              </div>
            </div>
            <div className="flex items-end gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs">✈</div>
              <div className="bg-white/8 border border-white/10 text-gray-200 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-sm">
                ✨ Generated a 3-day itinerary for Ooty! Includes Botanical Gardens, Doddabetta Peak, Rose Garden + budget breakdown under ₹9,500...
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Travel Smart</h2>
          <p className="text-gray-400 text-lg">AI-powered features designed to make trip planning effortless</p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group p-6 bg-white/4 border border-white/8 rounded-2xl hover:border-violet-500/30 hover:bg-white/6 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/25 rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Explore the World?</h2>
          <p className="text-gray-400 mb-8">Join thousands of travelers planning smarter with AI.</p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-xl shadow-violet-500/25 text-sm"
          >
            Get Started — It's Free ✈️
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>© 2026 SmartTravel · Built with ❤️ using Google Gemini AI</p>
      </footer>
    </div>
  );
}
