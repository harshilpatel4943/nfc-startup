import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [overall, setOverall] = useState<string>('🤩');
  const [foodRating, setFoodRating] = useState<number>(5);
  const [ambienceRating, setAmbienceRating] = useState<number>(5);
  const [serviceRating, setServiceRating] = useState<number>(5);
  const [visitAgain, setVisitAgain] = useState<string>('YES');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  const renderStars = (rating: number, setRating: (r: number) => void) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="p-1 focus:outline-none transition-transform active:scale-125"
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? 'fill-[#C6A477] text-[#C6A477]' : 'text-[#5A3926]'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-sm bg-[#171411] border border-[#C6A477]/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-[#EFE4CF] my-auto max-h-[88dvh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#5A3926]/30 text-[#C6A477] hover:text-[#FFF1D1] active:scale-95 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center animate-fadeIn">
                <CheckCircle className="w-14 h-14 text-[#C6A477] mx-auto mb-3 animate-bounce" />
                <h3 className="font-serif text-2xl font-bold text-[#FFF1D1]">Thank You!</h3>
                <p className="text-sm text-[#EFE4CF]/80 mt-2">
                  Your feedback helps us refine the Cave experience.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/15 text-[#007AFF] flex items-center justify-center border border-[#007AFF]/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
                      100% ANONYMOUS GUEST FEEDBACK
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#FFF1D1]">
                      TELL US ABOUT YOUR VISIT
                    </h2>
                  </div>
                </div>

                {/* Mood Selector */}
                <div className="bg-[#5A3926]/20 p-3 rounded-xl border border-[#C6A477]/30 flex justify-around">
                  {['🤩', '😊', '😐', '🙁'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setOverall(emoji)}
                      className={`text-2xl p-2 rounded-lg transition-transform ${
                        overall === emoji ? 'bg-[#5A3926]/60 scale-125 shadow-md' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Rating Rows */}
                <div className="space-y-3 bg-[#5A3926]/10 p-3.5 rounded-xl border border-[#C6A477]/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#EFE4CF]">Food & Beverage Quality</span>
                    {renderStars(foodRating, setFoodRating)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#EFE4CF]">Atmosphere & Ambience</span>
                    {renderStars(ambienceRating, setAmbienceRating)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#EFE4CF]">Staff Service Speed</span>
                    {renderStars(serviceRating, setServiceRating)}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-xs font-bold text-[#C6A477] mb-1">
                    Comments or Suggestions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share any special compliments or details for management..."
                    className="w-full bg-[#5A3926]/20 border border-[#C6A477]/30 rounded-xl p-3 text-xs text-[#FFF1D1] placeholder-[#EFE4CF]/40 focus:outline-none focus:border-[#C6A477]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all"
                >
                  Submit Anonymous Feedback
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
