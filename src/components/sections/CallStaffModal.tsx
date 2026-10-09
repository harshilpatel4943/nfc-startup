import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Droplet, Receipt, UserCheck, CheckCircle2 } from 'lucide-react';
import { TribalDivider } from '../common/TribalDivider';
import { addGuestRequest } from '../../data/demoStore';

interface CallStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: number;
}

export const CallStaffModal: React.FC<CallStaffModalProps> = ({ isOpen, onClose, tableNumber }) => {
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
    addGuestRequest(tableNumber, type);
    setActiveRequest(type);
    setTimeout(() => {
      setActiveRequest(null);
      onClose();
    }, 2500);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-sm bg-[#171411] border border-[#C6A477]/50 rounded-3xl p-5 sm:p-6 shadow-2xl text-[#EFE4CF] max-h-[85vh] overflow-y-auto shrink-0"
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
            <h3 className="font-serif text-xl font-bold text-[#FFF1D1]">Request recorded</h3>
            <p className="text-xs font-sans text-[#EFE4CF]/80 mt-2">
              Demo request for: <br />
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
    </AnimatePresence>,
    document.body
  );
};
