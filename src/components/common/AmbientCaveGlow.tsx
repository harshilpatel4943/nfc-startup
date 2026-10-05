import React from 'react';
import { motion } from 'framer-motion';

interface AmbientCaveGlowProps {
  isDarkMode?: boolean;
}

// Rising fire flame ember balls
const FIRE_FLAME_BALLS = [
  { id: 1, left: '12%', size: 5, duration: 7, delay: 0 },
  { id: 2, left: '28%', size: 3.5, duration: 9, delay: 1.8 },
  { id: 3, left: '48%', size: 6, duration: 8, delay: 0.5 },
  { id: 4, left: '68%', size: 4, duration: 10, delay: 2.4 },
  { id: 5, left: '85%', size: 5, duration: 7.5, delay: 1.2 },
  { id: 6, left: '92%', size: 3, duration: 8.5, delay: 3.2 },
];

export const AmbientCaveGlow: React.FC<AmbientCaveGlowProps> = ({ isDarkMode = true }) => {
  if (!isDarkMode) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none gpu-accelerate">
      {/* 1. Top Warm Terracotta Ambient Light Aura */}
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.22, 0.32, 0.22],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(140,81,56,0.5)_0%,rgba(18,15,13,0)_70%)] blur-3xl gpu-accelerate"
      />

      {/* 2. Middle Luxury Gold Accent Glow */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.28, 0.15],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(circle,rgba(198,164,119,0.4)_0%,rgba(18,15,13,0)_75%)] blur-3xl gpu-accelerate"
      />

      {/* 3. Bottom Subterranean Firelight Warmth */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.18, 0.3, 0.18],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(140,81,56,0.4)_0%,rgba(18,15,13,0)_70%)] blur-3xl gpu-accelerate"
      />

      {/* 4. Rising Glowing Fire Flame Balls */}
      {FIRE_FLAME_BALLS.map((ball) => (
        <motion.div
          key={ball.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.7, 0.9, 0],
            x: [0, 16, -16, 0],
            scale: [0.8, 1.2, 0.9],
          }}
          transition={{
            duration: ball.duration,
            repeat: Infinity,
            delay: ball.delay,
            ease: 'easeInOut',
          }}
          style={{
            left: ball.left,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
          }}
          className="absolute rounded-full bg-gradient-to-t from-[#8C5138] via-[#C6A477] to-[#FFF1D1] shadow-[0_0_12px_rgba(198,164,119,0.95)] gpu-accelerate"
        />
      ))}
    </div>
  );
};
