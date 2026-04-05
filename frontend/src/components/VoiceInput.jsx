import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceInput({ onTranscript }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Voice input not supported in this browser.');
      return;
    }

    setError('');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      setListening(false);
      setError(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice error: ' + e.error);
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="relative flex items-center">
      <motion.button
        type="button"
        onClick={listening ? stopListening : startListening}
        whileTap={{ scale: 0.9 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          listening
            ? 'bg-red-500 shadow-lg shadow-red-500/40'
            : 'bg-white/10 hover:bg-white/20'
        }`}
        title={listening ? 'Stop listening' : 'Use voice input'}
      >
        <AnimatePresence mode="wait">
          {listening ? (
            <motion.span
              key="stop"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-white text-sm"
            >
              ■
            </motion.span>
          ) : (
            <motion.svg
              key="mic"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-4 h-4 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 15.2 14.47 17 12 17s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Listening pulse ring */}
      {listening && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-red-400"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {error && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-red-400 bg-gray-900 px-2 py-1 rounded">
          {error}
        </span>
      )}
    </div>
  );
}
