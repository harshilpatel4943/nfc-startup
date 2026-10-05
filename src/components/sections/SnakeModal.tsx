import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Trophy, Gamepad2, Move } from 'lucide-react';

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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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

  // Handle Game Loop
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || !isOpen) return;

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
          return prevSnake;
        }

        // Check Self Collision
        for (let i = 0; i < prevSnake.length; i++) {
          if (prevSnake[i].x === head.x && prevSnake[i].y === head.y) {
            setIsGameOver(true);
            setIsPlaying(false);
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Check Food Collision
        if (head.x === food.x && head.y === food.y) {
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
    }, INITIAL_SPEED);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isPaused, isGameOver, food, generateFood, highScore, isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 h-[100dvh] w-screen z-50 flex flex-col items-center justify-center my-auto p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="w-full max-w-sm bg-[#171411] border border-[#C6A477]/40 rounded-3xl p-5 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-[#EFE4CF] my-auto overflow-hidden flex flex-col"
          >
            {/* Action Bar (Pause & Close) */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
              {isPlaying && !isGameOver && (
                <button
                  onClick={togglePause}
                  className="px-2.5 py-1 rounded-full bg-[#8C5138]/40 border border-[#C6A477]/40 text-[#C6A477] text-xs font-bold flex items-center gap-1 hover:bg-[#8C5138] hover:text-white transition-all active:scale-95"
                  aria-label="Pause or Resume game"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors active:scale-95"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#8C5138]/20 border border-[#C6A477]/40 text-[#C6A477] flex items-center justify-center shadow-inner">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
                  Cave Snake Game
                </h3>
                <p className="text-[11px] text-[#C6A477] font-medium flex items-center gap-1">
                  <Move className="w-3 h-3 text-[#C6A477]" /> Swipe on screen to move
                </p>
              </div>
            </div>

            {/* Scoreboard */}
            <div className="flex items-center justify-between bg-black/50 border border-[#C6A477]/20 rounded-2xl px-4 py-2 mb-3 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-white">
                <span>SCORE:</span>
                <span className="text-[#C6A477] font-mono text-sm">{score}</span>
              </div>
              <div className="flex items-center space-x-1.5 font-bold text-gray-400">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>BEST:</span>
                <span className="text-amber-400 font-mono text-sm">{highScore}</span>
              </div>
            </div>

            {/* Touch Swipe Interactive Game Canvas Board */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative w-full aspect-square bg-black/90 rounded-2xl border border-[#C6A477]/30 overflow-hidden shadow-inner p-1 select-none touch-none"
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
                      className={`rounded-sm transition-all duration-75 ${
                        isHead
                          ? 'bg-gradient-to-tr from-[#8C5138] to-[#C6A477] shadow-[0_0_10px_#C6A477]'
                          : isBody
                          ? 'bg-[#C6A477]/80'
                          : isFoodCell
                          ? 'bg-[#FF2D55] animate-pulse rounded-full shadow-[0_0_12px_#FF2D55]'
                          : 'bg-white/[0.02]'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Start / Pause / Game Over Overlay */}
              {(!isPlaying || isPaused || isGameOver) && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                  {isGameOver ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <h4 className="text-lg font-extrabold text-white">Game Over!</h4>
                      <p className="text-xs text-gray-400 mt-1">Final Score: <span className="text-[#C6A477] font-bold">{score}</span></p>
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
                      <h4 className="text-lg font-extrabold text-white">Game Paused</h4>
                      <p className="text-xs text-gray-400 mt-1">Take your time! Tap below to resume.</p>
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
                      <h4 className="text-base font-extrabold text-white">Ready to Play?</h4>
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

            {/* Mobile Touch Swipe Hint Footer */}
            <div className="mt-3 text-center">
              <span className="text-[10px] font-sans text-gray-400 tracking-wider uppercase font-semibold">
                👈 Swipe Left / Right / Up / Down 👉
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
