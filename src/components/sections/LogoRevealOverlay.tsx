import React, { useEffect, useState } from 'react';
import { Logo } from '../common/Logo';

interface LogoRevealOverlayProps {
  onComplete: () => void;
}

export const LogoRevealOverlay: React.FC<LogoRevealOverlayProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'glow' | 'logo' | 'fadeout'>('glow');

  useEffect(() => {
    // Phase 1 -> Phase 2: Logo Reveal at 250ms
    const timer1 = setTimeout(() => setStage('logo'), 250);
    // Phase 2 -> Phase 3: Fadeout at 850ms
    const timer2 = setTimeout(() => setStage('fadeout'), 850);
    // Complete callback at 1150ms (~1 second total duration)
    const timer3 = setTimeout(() => onComplete(), 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#120F0D] transition-opacity duration-300 select-none cursor-pointer ${
        stage === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      title="Tap to enter immediately"
    >
      {/* Background Radial Light Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,241,209,0.22)_0%,rgba(74,46,29,0.3)_40%,rgba(18,15,13,1)_80%)]" />

      {/* Brand Reveal Elements */}
      <div className={`relative z-10 flex flex-col items-center transform transition-all duration-500 ${
        stage === 'logo' || stage === 'fadeout' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        <Logo size="lg" />
        
        <div className="mt-4 text-center">
          <h1 className="font-display text-2xl font-black tracking-[0.2em] text-[#EFE4CF]">
            THE CAVE
          </h1>
          <p className="text-[10px] font-sans tracking-[0.28em] text-[#C6A477] uppercase font-bold mt-0.5">
            Regional Indian Cuisine
          </p>
        </div>

        <span className="text-[9px] font-sans text-[#EFE4CF]/40 tracking-wider mt-4">
          Tap anywhere to enter
        </span>
      </div>
    </div>
  );
};
