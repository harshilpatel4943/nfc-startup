import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { TribalDivider } from '../common/TribalDivider';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 bg-[#171411]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#171411] border border-[#C6A477]/50 rounded-2xl p-6 shadow-2xl cave-dark-texture text-[#EFE4CF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#5A3926]/30 text-[#C6A477] hover:text-[#FFF1D1]"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center animate-fadeIn">
            <CheckCircle className="w-12 h-12 text-[#C6A477] mx-auto mb-3 animate-bounce" />
            <h3 className="font-serif text-2xl font-bold text-[#FFF1D1]">Thank You!</h3>
            <p className="text-xs font-sans text-[#EFE4CF]/80 mt-2 max-w-xs mx-auto">
              Your feedback helps us continuously refine the Cave dining experience.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
                PRIVATE GUEST FEEDBACK
              </span>
              <h2 className="font-serif text-xl font-bold text-[#FFF1D1] mt-1">
                TELL US ABOUT YOUR EXPERIENCE
              </h2>
              <TribalDivider variant="minimal" />
            </div>

            {/* Overall Experience Emoji */}
            <div>
              <label className="block text-xs font-sans text-[#C6A477] uppercase font-semibold mb-2 text-center">
                Overall Experience
              </label>
              <div className="flex justify-around bg-[#5A3926]/20 p-2 rounded-xl border border-[#5A3926]/40">
                {['😞', '😐', '🙂', '😍', '🤩'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setOverall(emoji)}
                    className={`text-2xl p-1.5 rounded-lg transition-transform ${
                      overall === emoji ? 'bg-[#C6A477]/30 scale-125' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratings Grid */}
            <div className="space-y-3 bg-[#5A3926]/15 p-3 rounded-xl border border-[#5A3926]/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[#EFE4CF]">Food & Flavour</span>
                {renderStars(foodRating, setFoodRating)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[#EFE4CF]">Cave Ambience</span>
                {renderStars(ambienceRating, setAmbienceRating)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[#EFE4CF]">Hospitality & Service</span>
                {renderStars(serviceRating, setServiceRating)}
              </div>
            </div>

            {/* Visit Again */}
            <div>
              <label className="block text-xs font-sans text-[#C6A477] uppercase font-semibold mb-2">
                Would you visit again?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['YES', 'MAYBE', 'NO'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVisitAgain(opt)}
                    className={`py-2 rounded-lg text-xs font-sans font-bold tracking-wider transition-all ${
                      visitAgain === opt
                        ? 'bg-[#C6A477] text-[#171411] shadow-[0_0_10px_rgba(198,164,119,0.3)]'
                        : 'bg-[#5A3926]/20 text-[#EFE4CF]/70 border border-[#C6A477]/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Comments */}
            <div>
              <label className="block text-xs font-sans text-[#C6A477] uppercase font-semibold mb-1">
                Tell us what we can improve (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Share your thoughts with our restaurant team..."
                className="w-full bg-[#171411] border border-[#5A3926] rounded-xl p-3 text-xs text-[#EFE4CF] focus:border-[#C6A477] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#C6A477] to-[#8C5138] text-[#171411] font-sans font-bold text-xs tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(198,164,119,0.3)]"
            >
              SEND FEEDBACK
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
