import React from 'react';

interface TribalDividerProps {
  variant?: 'chevron' | 'circles' | 'petals' | 'hunter' | 'minimal';
  className?: string;
  color?: string;
}

export const TribalDivider: React.FC<TribalDividerProps> = ({ 
  variant = 'chevron', 
  className = '',
  color = '#C6A477' 
}) => {
  if (variant === 'hunter') {
    return (
      <div className={`flex items-center justify-center space-x-3 my-6 opacity-90 ${className}`}>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C6A477]/40 to-[#C6A477]/70"></div>
        
        {/* Hunter & Prehistoric Fauna Line Art SVG from Cave Murals */}
        <div className="flex items-center space-x-2 text-[#C6A477]">
          {/* Hunter Figure */}
          <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="6" r="3" fill="currentColor" />
            <path d="M16 9V19M16 19L11 27M16 19L21 27" strokeLinecap="round" />
            <path d="M10 13L16 11L24 10" strokeLinecap="round" />
            <path d="M24 6V18" strokeLinecap="round" strokeDasharray="1 1" />
          </svg>

          {/* Campfire */}
          <svg className="w-5 h-5 text-[#8C5138]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 19L17 13M7 13L17 19" strokeLinecap="round" />
            <path d="M12 5C12 5 15 9 15 12C15 14 13.5 16 12 16C10.5 16 9 14 9 12C9 9 12 5 12 5Z" fill="#C6A477" fillOpacity="0.6" />
          </svg>

          {/* Deer Fauna Silhouette */}
          <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 22L10 16H18L24 12V6M24 6L22 4M24 6L26 4" strokeLinecap="round" />
            <path d="M10 16L9 26M13 16L13 26M18 16L18 26M22 14L22 26" strokeLinecap="round" />
          </svg>
        </div>

        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C6A477]/40 to-[#C6A477]/70"></div>
      </div>
    );
  }

  if (variant === 'circles') {
    return (
      <div className={`flex items-center justify-center space-x-3 my-6 opacity-85 ${className}`}>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C6A477]/40 to-[#C6A477]/80"></div>
        <svg className="w-7 h-7 text-[#C6A477]" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="20" cy="20" r="12" stroke={color} strokeWidth="1" />
          <circle cx="20" cy="20" r="5" fill={color} />
        </svg>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C6A477]/40 to-[#C6A477]/80"></div>
      </div>
    );
  }

  if (variant === 'petals') {
    return (
      <div className={`flex items-center justify-center space-x-2 my-8 ${className}`}>
        <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#C6A477]/60"></div>
        <svg className="w-6 h-6 text-[#C6A477]" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 2 16 7 16 12C16 17 12 22 12 22C12 22 8 17 8 12C8 7 12 2 12 2Z" fill={color} fillOpacity="0.8" />
          <path d="M2 12C2 12 7 16 12 16C17 16 22 12 22 12C22 12 17 8 12 8C7 8 2 12 2 12Z" fill={color} fillOpacity="0.8" />
        </svg>
        <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#C6A477]/60"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center my-6 ${className}`}>
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C6A477]/30 to-[#C6A477]/60"></div>
      <div className="mx-4 flex items-center space-x-2 text-[#C6A477]/80">
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L16 8L8 16L0 8L8 0Z" fill={color} />
        </svg>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke={color} strokeWidth="1.5" />
        </svg>
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L16 8L8 16L0 8L8 0Z" fill={color} />
        </svg>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C6A477]/30 to-[#C6A477]/60"></div>
    </div>
  );
};
