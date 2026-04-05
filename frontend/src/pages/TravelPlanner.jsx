import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import ChatMessage from '../components/ChatMessage';
import { TypingIndicator } from '../components/LoadingSpinner';
import ItineraryDisplay from '../components/ItineraryDisplay';
import VoiceInput from '../components/VoiceInput';
import { generatePlan, saveTrip } from '../services/tripService';

const SUGGESTIONS = [
  'Plan a 3-day trip to Ooty under ₹10,000',
  'Weekend trip to Pondicherry for 2 people under ₹8,000',
  'Plan a 5-day Rajasthan tour under ₹25,000',
  'Budget trip to Coorg for 3 days under ₹12,000',
];

export default function TravelPlanner() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: "Hi! I'm your AI travel planner ✈️\n\nTell me where you want to go, for how many days, and your budget. I'll create a complete itinerary for you!\n\nExample: \"Plan a 3-day trip to Ooty under ₹10,000\"" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
  };

  const handleSend = async (promptText) => {
    const text = (promptText || input).trim();
    if (!text || loading) return;

    setInput('');
    setError('');
    setCurrentPlan(null);
    setSaved(false);
    setCurrentPrompt(text);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const plan = await generatePlan(text);
      setCurrentPlan(plan);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: `✅ Here's your ${plan.duration}-day itinerary for **${plan.destination}**!\nTotal estimated budget: ${plan.totalBudgetEstimate}\n\nScroll down to see the full plan ↓`,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate plan. Please try again.');
      const errMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: '❌ Sorry, I couldn\'t generate your travel plan. Please check your request and try again.',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentPlan || saving || saved) return;
    setSaving(true);
    try {
      await saveTrip(currentPlan, currentPrompt);
      setSaved(true);
    } catch {
      alert('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([{
      id: 1, role: 'ai',
      content: "Hi! I'm your AI travel planner ✈️\n\nTell me where you want to go, for how many days, and your budget.\n\nExample: \"Plan a 3-day trip to Ooty under ₹10,000\"",
    }]);
    setCurrentPlan(null);
    setInput('');
    setSaved(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 pt-20 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-white/8 mb-4">
          <div>
            <h1 className="text-lg font-bold text-white">AI Travel Planner</h1>
            <p className="text-gray-500 text-xs">Powered by Gemini AI</p>
          </div>
          <button
            onClick={handleNewChat}
            className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all flex items-center gap-1.5"
          >
            🔄 New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto pb-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {loading && <TypingIndicator />}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm mb-4"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Itinerary */}
          <AnimatePresence>
            {currentPlan && (
              <ItineraryDisplay
                plan={currentPlan}
                onSave={handleSave}
                saving={saving}
                saved={saved}
              />
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 text-gray-400 hover:text-white text-xs rounded-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="bg-white/5 border border-white/10 focus-within:border-violet-500/50 rounded-2xl p-3 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e); }}
            onKeyDown={handleKeyDown}
            placeholder="E.g. Plan a 3-day trip to Ooty under ₹10,000..."
            rows={1}
            className="w-full bg-transparent text-white placeholder-gray-600 text-sm resize-none outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <VoiceInput onTranscript={(t) => setInput((prev) => prev + t)} />
              <span className="text-gray-600 text-xs">or type your trip idea</span>
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Send <span>→</span></>
              )}
            </button>
          </div>
        </div>
        <p className="text-gray-700 text-xs text-center mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
