import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

interface EdgeFlowCardProps {
  onClick: () => void;
  isDarkMode?: boolean;
}

export const EdgeFlowCard: React.FC<EdgeFlowCardProps> = ({ onClick, isDarkMode = true }) => {
  const config = {
    colorA: '#C6A477',
    colorB: '#8C5138',
    bgColor: isDarkMode ? '#1C1815' : '#FFF9F2',
    textColor: isDarkMode ? '#EFE4CF' : '#1C1C1E',
    radius: 16,
    borderWidth: 1.5,
    speed: 3.2,
    glow: 16,
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="edge-flow-card-wrapper w-full cursor-pointer text-left focus:outline-none"
      style={{
        borderRadius: `${config.radius}px`,
        padding: `${config.borderWidth}px`,
      }}
    >
      <style>{`
        @keyframes edge-flow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .edge-flow-card-wrapper {
          position: relative;
          overflow: hidden;
          display: block;
        }
        .edge-flow-card-wrapper::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 250%;
          aspect-ratio: 1;
          opacity: 0.85;
          transform: translate(-50%, -50%);
          animation: edge-flow-spin ${config.speed}s linear infinite;
          background: conic-gradient(
            from 0deg,
            ${config.colorA} 0deg,
            ${config.colorA} 15deg,
            color-mix(in srgb, ${config.colorA} 45%, transparent) 30deg,
            transparent 60deg,
            transparent 150deg,
            color-mix(in srgb, ${config.colorB} 45%, transparent) 170deg,
            ${config.colorB} 180deg,
            ${config.colorB} 195deg,
            color-mix(in srgb, ${config.colorB} 45%, transparent) 210deg,
            transparent 240deg,
            transparent 330deg,
            color-mix(in srgb, ${config.colorA} 45%, transparent) 350deg,
            ${config.colorA} 360deg
          );
          filter: blur(${Math.max(0, config.glow * 0.3)}px);
          transition: opacity 300ms ease;
        }
        .edge-flow-card-wrapper::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 250%;
          aspect-ratio: 1;
          opacity: 1;
          transform: translate(-50%, -50%);
          animation: edge-flow-spin ${config.speed}s linear infinite;
          background: conic-gradient(
            from 0deg,
            ${config.colorA} 0deg,
            ${config.colorA} 8deg,
            transparent 35deg,
            transparent 170deg,
            ${config.colorB} 180deg,
            ${config.colorB} 188deg,
            transparent 215deg,
            transparent 350deg,
            ${config.colorA} 360deg
          );
        }
        .edge-flow-card-wrapper:hover::before {
          opacity: 1;
        }
        .edge-flow-inner-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 16px;
          border-radius: ${Math.max(0, config.radius - config.borderWidth)}px;
          background: ${config.bgColor};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transition: background-color 300ms ease;
        }
      `}</style>

      <div className="edge-flow-inner-content">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-[#8C5138]/20 flex items-center justify-center text-[#FF9500] shrink-0 shadow-sm border border-[#C6A477]/30">
            <BookOpen className="w-5 h-5 text-[#C6A477]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base leading-snug" style={{ color: config.textColor }}>
                View Menu
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white shadow-sm">
                Interactive
              </span>
            </div>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Full Parchment Menu & Pricing
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#C6A477] transition-all group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
};
