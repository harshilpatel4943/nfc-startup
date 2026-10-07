import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Trophy, Gamepad2, Move, ArrowLeft } from 'lucide-react';

interface SnakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const INITIAL_SPEED = 135;

export const SnakeModal: React.FC<SnakeModalProps> = ({ isOpen, onClose }) => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 },
  ]);
  const [food, setFood] = useState<Position>({ x: 4, y: 4 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('cave_snake_high_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const directionRef = useRef<Direction>(direction);
  directionRef.current = direction;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Generate random food position not on snake
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 },
    ];
    setSnake(initialSnake);
    setDirection('UP');
    directionRef.current = 'UP';
    setFood(generateFood(initialSnake));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const togglePause = () => {
    if (isPlaying && !isGameOver) {
      setIsPaused((prev) => !prev);
    }
  };

  // Touch Swipe Gesture Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current || !isPlaying || isPaused || isGameOver) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartPos.current.x;
    const deltaY = touch.clientY - touchStartPos.current.y;
    const minSwipeDistance = 25;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && directionRef.current !== 'LEFT') {
          setDirection('RIGHT');
        } else if (deltaX < 0 && directionRef.current !== 'RIGHT') {
          setDirection('LEFT');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && directionRef.current !== 'UP') {
          setDirection('DOWN');
        } else if (deltaY < 0 && directionRef.current !== 'DOWN') {
          setDirection('UP');
        }
      }
    }
    touchStartPos.current = null;
  };

  // Handle Game Loop with Progressive Speed Curve & Haptic Vibrations
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || !isOpen) return;

    // Calculate dynamic speed based on score (speed increases every 30 pts down to 65ms)
    const currentSpeed = Math.max(65, INITIAL_SPEED - Math.floor(score / 30) * 8);

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;

        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        // Check Wall Collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          setIsPlaying(false);
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try { navigator.vibrate([60, 40, 80]); } catch {}
          }
          return prevSnake;
        }

        // Check Self Collision
        for (let i = 0; i < prevSnake.length; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            setIsGameOver(true);
            setIsPlaying(false);
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
              try { navigator.vibrate([60, 40, 80]); } catch {}
            }
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try { navigator.vibrate(35); } catch {}
          }
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('cave_snake_high_score', nextScore.toString());
            }
            return nextScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, currentSpeed);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isPaused, isGameOver, food, generateFood, highScore, isOpen, score]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const key = e.key;

      if (key === ' ') {
        togglePause();
        return;
      }

      if ((key === 'ArrowUp' || key === 'w' || key === 'W') && directionRef.current !== 'DOWN') {
        setDirection('UP');
      } else if ((key === 'ArrowDown' || key === 's' || key === 'S') && directionRef.current !== 'UP') {
        setDirection('DOWN');
      } else if ((key === 'ArrowLeft' || key === 'a' || key === 'A') && directionRef.current !== 'RIGHT') {
        setDirection('LEFT');
      } else if ((key === 'ArrowRight' || key === 'd' || key === 'D') && directionRef.current !== 'LEFT') {
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, isGameOver]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 h-[100dvh] w-full z-[9999] bg-[#120F0D] text-[#EFE4CF] flex flex-col justify-between p-3.5 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-hidden select-none">
          {/* Fullscreen Header Navigation Bar */}
          <div className="w-full max-w-md mx-auto flex items-center justify-between py-1.5 border-b border-[#C6A477]/20 shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#191512] border border-[#C6A477]/40 text-xs font-bold text-[#EFE4CF] active:scale-95 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#C6A477]" />
              <span>BACK TO HOME</span>
            </button>

            <div className="flex items-center space-x-2">
              {isPlaying && !isGameOver && (
                <button
                  onClick={togglePause}
                  className="px-3 py-1.5 rounded-full bg-[#8C5138]/40 border border-[#C6A477]/40 text-[#C6A477] text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-300 hover:text-white flex items-center justify-center active:scale-95"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Arcade Area */}
          <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center min-h-0 py-2">
            {/* Game Title & Scoreboard */}
            <div className="w-full flex items-center justify-between mb-2 px-1 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-[#8C5138]/20 border border-[#C6A477]/40 text-[#C6A477] flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-xs text-white tracking-tight">
                  Cave Arcade Snake
                </h3>
              </div>

              <div className="flex items-center space-x-2.5 text-[11px] font-mono font-bold bg-black/60 border border-[#C6A477]/20 rounded-xl px-2.5 py-1">
                <div className="flex items-center space-x-1 text-white">
                  <span className="text-gray-400">SCORE:</span>
                  <span className="text-[#C6A477]">{score}</span>
                </div>
                <div className="flex items-center space-x-1 text-amber-400">
                  <Trophy className="w-3 h-3" />
                  <span>{highScore}</span>
                </div>
              </div>
            </div>

            {/* Touch Swipe Full Width Board */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full max-h-[58vh] aspect-square bg-black/95 rounded-2xl border-2 border-[#C6A477]/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-1 select-none touch-none shrink-0"
            >
              {/* Grid Cells */}
              <div
                className="w-full h-full grid gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                  const x = index % GRID_SIZE;
                  const y = Math.floor(index / GRID_SIZE);

                  const isHead = snake[0].x === x && snake[0].y === y;
                  const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
                  const isFoodCell = food.x === x && food.y === y;

                  return (
                    <div
                      key={index}
                      className={`rounded-sm transition-all duration-75 relative flex items-center justify-center ${
                        isHead
                          ? 'bg-gradient-to-tr from-[#8C5138] to-[#FFF1D1] shadow-[0_0_12px_#FFF1D1] z-10'
                          : isBody
                          ? 'bg-gradient-to-tr from-[#8C5138]/90 to-[#C6A477]/90'
                          : isFoodCell
                          ? 'bg-[#FF2D55] animate-pulse rounded-full shadow-[0_0_14px_#FF2D55]'
                          : 'bg-white/[0.02]'
                      }`}
                    >
                      {isHead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#120F0D]" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overlays */}
              {(!isPlaying || isPaused || isGameOver) && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                  {isGameOver ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <h4 className="text-xl font-extrabold text-white">Game Over!</h4>
                      <p className="text-xs text-gray-400 mt-1">Final Score: <span className="text-[#C6A477] font-bold text-sm">{score}</span></p>
                      <button
                        onClick={resetGame}
                        className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white text-xs font-extrabold shadow-lg flex items-center space-x-2 active:scale-95 transition-all mx-auto"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Play Again</span>
                      </button>
                    </motion.div>
                  ) : isPaused ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <h4 className="text-xl font-extrabold text-white">Game Paused</h4>
                      <p className="text-xs text-gray-400 mt-1">Tap below when you're ready to resume.</p>
                      <button
                        onClick={togglePause}
                        className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white text-xs font-extrabold shadow-lg flex items-center space-x-2 active:scale-95 transition-all mx-auto"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Resume Game</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <h4 className="text-lg font-extrabold text-white">Ready for Arcade?</h4>
                      <p className="text-xs text-gray-400 mt-1">Swipe anywhere on screen to steer!</p>
                      <button
                        onClick={resetGame}
                        className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white text-xs font-extrabold shadow-lg flex items-center space-x-2 active:scale-95 transition-all mx-auto"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Game</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer Navigation Back Button Bar */}
          <div className="w-full max-w-md mx-auto pt-2 border-t border-[#C6A477]/20 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 active:scale-98 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>EXIT GAME TO MAIN MENU</span>
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
