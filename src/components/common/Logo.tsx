import React from 'react';

interface LogoProps {
  variant?: 'circular-sign' | 'wordmark' | 'minimal';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'circular-sign', className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-11 h-11 text-[11px]',
    md: 'w-16 h-16 text-sm',
    lg: 'w-28 h-28 text-base',
    xl: 'w-40 h-40 text-xl'
  };

  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col items-center justify-center font-display tracking-wider ${className}`}>
        <div className="flex items-center space-x-1.5 text-[#EFE4CF]">
          <span className="font-bold tracking-widest text-lg sm:text-2xl border-b-2 border-[#EFE4CF] pb-0.5">THE</span>
          <div className="relative flex items-center justify-center">
            <span className="font-extrabold tracking-widest text-xl sm:text-3xl text-[#EFE4CF]">C</span>
            {/* Cave Arch in 'A' matching exact sign photo */}
            <div className="relative mx-0.5 inline-flex items-center justify-center">
              <svg className="w-5 h-6 sm:w-7 sm:h-8" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L27 30H1L14 2Z" fill="#EFE4CF" />
                <path d="M14 13C11.5 13 9.5 16 9.5 30H18.5C18.5 16 16.5 13 14 13Z" fill="#120F0D" />
              </svg>
            </div>
            <span className="font-extrabold tracking-widest text-xl sm:text-3xl text-[#EFE4CF]">VE</span>
          </div>
        </div>
        <div className="mt-1 text-[10px] sm:text-xs font-sans tracking-[0.22em] text-[#C6A477] font-semibold uppercase flex items-center space-x-1">
          <span className="text-[#8C5138] font-bold">[</span>
          <span>REGIONAL INDIAN CUISINE</span>
          <span className="text-[#8C5138] font-bold">]</span>
        </div>
      </div>
    );
  }

  // Primary circular illuminated sign as seen in the uploaded restaurant photo cave-logo-sign.jpg
  return (
    <div className={`relative flex items-center justify-center group ${className}`}>
      {/* Warm Ambient Radial Light Halo */}
      <div className="absolute inset-0 rounded-full bg-[#FFF1D1]/20 blur-xl group-hover:bg-[#FFF1D1]/35 transition-all duration-700 animate-pulse"></div>
      
      {/* Circular Lighted Globe Sign */}
      <div className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-b from-[#FFFDF7] via-[#FFF3D6] to-[#E2CEAA] text-[#120F0D] flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,241,209,0.5)] border-2 border-[#FFF1D1] p-2 overflow-hidden select-none transform transition-transform duration-500 hover:scale-105`}>
        {/* Soft inner radial light diffusion pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,rgba(226,206,170,0.4)_70%,rgba(140,81,56,0.15)_100%)]"></div>
        
        {/* Logo Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* THE CAVE Wordmark */}
          <div className="flex items-center space-x-0.5 font-extrabold tracking-tighter leading-none text-[#120F0D]">
            <span className="text-[0.62em] tracking-normal border-b-2 border-[#120F0D] pb-0.5 mr-0.5 font-bold">THE</span>
            <span className="text-[1.15em] font-black tracking-wider">C</span>
            
            {/* Cave Mountain Arch 'A' */}
            <div className="relative inline-block mx-[1px]">
              <svg className="w-[1.05em] h-[1.15em] inline-block" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L27 30H1L14 2Z" fill="#120F0D" />
                <path d="M14 13C11.5 13 9.5 16 9.5 30H18.5C18.5 16 16.5 13 14 13Z" fill="#FFF3D6" />
              </svg>
            </div>
            
            <span className="text-[1.15em] font-black tracking-wider">VE</span>
          </div>

          {/* Tagline [ REGIONAL INDIAN CUISINE ] */}
          <div className="mt-1 flex items-center justify-center space-x-0.5 text-[0.42em] font-sans font-bold tracking-[0.16em] text-[#3A2417] uppercase whitespace-nowrap">
            <span className="text-[#8C5138] font-black text-[1.2em]">[</span>
            <span className="tracking-[0.18em]">REGIONAL INDIAN CUISINE</span>
            <span className="text-[#8C5138] font-black text-[1.2em]">]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
