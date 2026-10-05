import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Droplet, Receipt, UserCheck, CheckCircle2 } from 'lucide-react';
import { TribalDivider } from '../common/TribalDivider';

interface CallStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallStaffModal: React.FC<CallStaffModalProps> = ({ isOpen, onClose }) => {
  const [activeRequest, setActiveRequest] = useState<string | null>(null);

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

  const handleRequest = (type: string) => {
    setActiveRequest(type);
    setTimeout(() => {
      setActiveRequest(null);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 h-[100dvh] w-screen z-50 flex flex-col items-center justify-center my-auto p-4 bg-black/80 backdrop-blur-md overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-sm bg-[#171411] border border-[#C6A477]/50 rounded-3xl p-6 shadow-2xl text-[#EFE4CF] my-auto overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#5A3926]/30 text-[#C6A477] hover:text-[#FFF1D1] active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

        {activeRequest ? (
          <div className="py-8 text-center animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-[#C6A477] mx-auto mb-3 animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-[#FFF1D1]">Staff Notified</h3>
            <p className="text-xs font-sans text-[#EFE4CF]/80 mt-2">
              Our team has received your request for: <br />
              <span className="font-bold text-[#C6A477] uppercase tracking-wider">{activeRequest}</span>
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-[#8C5138]/30 border border-[#8C5138]/60 text-[#C6A477] mx-auto flex items-center justify-center mb-2">
                <Bell className="w-6 h-6 text-[#C6A477] animate-pulse" />
              </div>
              <span className="text-[10px] font-sans tracking-[0.25em] text-[#C6A477] uppercase font-bold">
                TABLE ASSISTANCE
              </span>
              <h2 className="font-serif text-xl font-bold text-[#FFF1D1] mt-1">
                CALL TABLE STAFF
              </h2>
              <TribalDivider variant="minimal" />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleRequest('Water Service')}
                className="w-full p-3.5 rounded-xl bg-[#5A3926]/20 border border-[#C6A477]/30 hover:border-[#C6A477] flex items-center space-x-3 text-left transition-all active:scale-95"
              >
                <Droplet className="w-5 h-5 text-[#C6A477]" />
                <div>
                  <span className="font-sans font-bold text-xs text-[#FFF1D1] block tracking-wide">
                    REQUEST WATER
                  </span>
                  <span className="text-[10px] font-sans text-[#EFE4CF]/60">Fresh table water refilled</span>
                </div>
              </button>

              <button
                onClick={() => handleRequest('Call Waiter')}
                className="w-full p-3.5 rounded-xl bg-[#5A3926]/20 border border-[#C6A477]/30 hover:border-[#C6A477] flex items-center space-x-3 text-left transition-all active:scale-95"
              >
                <UserCheck className="w-5 h-5 text-[#C6A477]" />
                <div>
                  <span className="font-sans font-bold text-xs text-[#FFF1D1] block tracking-wide">
                    CALL WAITER
                  </span>
                  <span className="text-[10px] font-sans text-[#EFE4CF]/60">Assistance with ordering or query</span>
                </div>
              </button>

              <button
                onClick={() => handleRequest('Request Bill')}
                className="w-full p-3.5 rounded-xl bg-[#5A3926]/20 border border-[#C6A477]/30 hover:border-[#C6A477] flex items-center space-x-3 text-left transition-all active:scale-95"
              >
                <Receipt className="w-5 h-5 text-[#C6A477]" />
                <div>
                  <span className="font-sans font-bold text-xs text-[#FFF1D1] block tracking-wide">
                    REQUEST BILL
                  </span>
                  <span className="text-[10px] font-sans text-[#EFE4CF]/60">Print & bring dining bill</span>
                </div>
              </button>
            </div>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
