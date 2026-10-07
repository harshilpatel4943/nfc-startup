import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Pause, Play, X } from 'lucide-react';

interface SnakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const COLS = 28;
const ROWS = 16;

const BASE_TICK_MS = 200;
const MIN_TICK_MS = 130;
const TICK_STEP = 2;
const FOOD_RESPAWN_DELAY = 300;
const JUST_ATE_DECAY_MS = 400;

const buildInitialSnake = (): Position[] => [
  { x: 8, y: 3 },
  { x: 7, y: 3 },
  { x: 6, y: 3 },
  { x: 5, y: 3 },
  { x: 4, y: 3 },
];

const isSameCell = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

const getRandomFood = (snake: Position[]): Position => {
  const empty: Position[] = [];
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (!snake.some((s) => s.x === x && s.y === y)) {
        empty.push({ x, y });
      }
    }
  }
  return empty[Math.floor(Math.random() * empty.length)];
};

const nextHead = (head: Position, direction: Direction): Position => {
  const map: Record<Direction, Position> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
  };
  const d = map[direction];
  return { x: head.x + d.x, y: head.y + d.y };
};

const headBorderRadius = (dir: Direction, r: number) => {
  switch (dir) {
    case 'UP':
      return `${r}% ${r}% 0 0`;
    case 'DOWN':
      return `0 0 ${r}% ${r}%`;
    case 'RIGHT':
      return `0 ${r}% ${r}% 0`;
    case 'LEFT':
      return `${r}% 0 0 ${r}%`;
  }
};

export const SnakeModal: React.FC<SnakeModalProps> = ({ isOpen, onClose }) => {
  const [snake, setSnake] = useState<Position[]>(() => buildInitialSnake());
  const [food, setFood] = useState<Position>(() => getRandomFood(buildInitialSnake()));
  const [foodVisible, setFoodVisible] = useState(true);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [tickMs, setTickMs] = useState(BASE_TICK_MS);
  const [justAteTick, setJustAteTick] = useState(0);

  const directionRef = useRef<Direction>('RIGHT');
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const foodTimeoutRef = useRef<number | null>(null);
  const justAteRafRef = useRef<number | null>(null);
  const justAteStartRef = useRef<number>(0);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (foodTimeoutRef.current) window.clearTimeout(foodTimeoutRef.current);
      if (justAteRafRef.current) cancelAnimationFrame(justAteRafRef.current);
    };
  }, []);

  const resetGame = useCallback(() => {
    if (foodTimeoutRef.current) {
      window.clearTimeout(foodTimeoutRef.current);
      foodTimeoutRef.current = null;
    }
    const initialSnake = buildInitialSnake();
    setSnake(initialSnake);
    setFood(getRandomFood(initialSnake));
    setFoodVisible(true);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setIsPlaying(true);
    setIsPaused(false);
    setIsGameOver(false);
    setScore(0);
    setTickMs(BASE_TICK_MS);
    setJustAteTick(0);
  }, []);

  const attemptDirectionChange = useCallback((next: Direction) => {
    const current = directionRef.current;
    const invalid =
      (current === 'UP' && next === 'DOWN') ||
      (current === 'DOWN' && next === 'UP') ||
      (current === 'LEFT' && next === 'RIGHT') ||
      (current === 'RIGHT' && next === 'LEFT');
    if (invalid) return;
    setDirection(next);
    directionRef.current = next;
  }, []);

  const togglePause = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    setIsPaused((prev) => !prev);
  }, [isPlaying, isGameOver]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current || !isPlaying || isPaused || isGameOver) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const threshold = 24;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) attemptDirectionChange(deltaX > 0 ? 'RIGHT' : 'LEFT');
    } else if (Math.abs(deltaY) > threshold) {
      attemptDirectionChange(deltaY > 0 ? 'DOWN' : 'UP');
    }
    touchStart.current = null;
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        togglePause();
        return;
      }
      const lowered = event.key.toLowerCase();
      if (event.key === 'ArrowUp' || lowered === 'w') attemptDirectionChange('UP');
      else if (event.key === 'ArrowDown' || lowered === 's') attemptDirectionChange('DOWN');
      else if (event.key === 'ArrowLeft' || lowered === 'a') attemptDirectionChange('LEFT');
      else if (event.key === 'ArrowRight' || lowered === 'd') attemptDirectionChange('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePause, attemptDirectionChange]);

  const triggerJustAte = useCallback(() => {
    justAteStartRef.current = performance.now();
    if (justAteRafRef.current) cancelAnimationFrame(justAteRafRef.current);
    const loop = () => {
      const t = Math.min(1, (performance.now() - justAteStartRef.current) / JUST_ATE_DECAY_MS);
      setJustAteTick(1 - t);
      if (t < 1) {
        justAteRafRef.current = requestAnimationFrame(loop);
      } else {
        setJustAteTick(0);
        justAteRafRef.current = null;
      }
    };
    justAteRafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || !isOpen) return;

    const interval = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        let movedHead = nextHead(head, directionRef.current);

        // Wrap walls (matches CodePen)
        if (movedHead.x < 0) movedHead.x = COLS - 1;
        else if (movedHead.x >= COLS) movedHead.x = 0;
        if (movedHead.y < 0) movedHead.y = ROWS - 1;
        else if (movedHead.y >= ROWS) movedHead.y = 0;

        const willEat = isSameCell(movedHead, food);
        const bodyToCheck = willEat ? currentSnake : currentSnake.slice(0, -1);
        const hitSelf = bodyToCheck.some((seg) => isSameCell(seg, movedHead));
        if (hitSelf) {
          setIsGameOver(true);
          setIsPlaying(false);
          return currentSnake;
        }

        const nextSnake = [movedHead, ...currentSnake];

        if (willEat) {
          setScore((s) => s + 1);
          setTickMs((ms) => Math.max(MIN_TICK_MS, ms - TICK_STEP));
          triggerJustAte();
          setFoodVisible(false);

          if (foodTimeoutRef.current) window.clearTimeout(foodTimeoutRef.current);
          foodTimeoutRef.current = window.setTimeout(() => {
            setSnake((latest) => {
              const newFood = getRandomFood(latest);
              setFood(newFood);
              setFoodVisible(true);
              return latest;
            });
          }, FOOD_RESPAWN_DELAY);
        } else {
          nextSnake.pop();
        }

        return nextSnake;
      });
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [food, isGameOver, isOpen, isPaused, isPlaying, tickMs, triggerJustAte]);

  const boardCells = useMemo(() => {
    const cells: React.ReactNode[] = [];
    const headLen = snake.length;

    // --- Board tiles (background + trail path toward food) ---
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const classes = ['tile'];

        if (foodVisible && (x === food.x || y === food.y)) {
          classes.push('path');
          if (x < food.x) classes.push('right');
          if (x > food.x) classes.push('left');
          if (y < food.y) classes.push('down');
          if (y > food.y) classes.push('up');
        }

        cells.push(
          <div
            key={`bg-${x}-${y}`}
            className={classes.join(' ')}
            style={{
              left: `${(x / COLS) * 100}%`,
              top: `${(y / ROWS) * 100}%`,
              width: `calc(${100 / COLS}% - 1px)`,
              height: `calc(${100 / ROWS}% - 1px)`,
            }}
          />
        );
      }
    }

    // --- Snake tiles ---
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      const alpha = 1 - (i / Math.max(1, headLen)) * 0.6;
      const scale = isHead ? 1 + justAteTick * 1 : 1;

      cells.push(
        <div
          key={`snake-${i}-${seg.x}-${seg.y}`}
          className="snake-tile"
          style={{
            left: `${(seg.x / COLS) * 100}%`,
            top: `${(seg.y / ROWS) * 100}%`,
            width: `calc(${100 / COLS}% - 1px)`,
            height: `calc(${100 / ROWS}% - 1px)`,
            backgroundColor: `rgba(255, 255, 255, ${alpha})`,
            boxShadow: isHead ? '0 0 6px rgba(255,255,255,0.8)' : 'none',
            borderRadius: isHead ? headBorderRadius(directionRef.current, 25) : 0,
            transform: `scale(${scale})`,
            transition: isHead ? 'transform 80ms linear, border-radius 80ms linear' : 'none',
            zIndex: 10 + i,
          }}
        />
      );
    }

    // --- Food tile ---
    if (foodVisible) {
      const pulse = 0.8 + Math.sin(Date.now() / 200) * 0.2;
      cells.push(
        <div
          key="food"
          className="food-tile"
          style={{
            left: `${(food.x / COLS) * 100}%`,
            top: `${(food.y / ROWS) * 100}%`,
            width: `calc(${100 / COLS}% - 1px)`,
            height: `calc(${100 / ROWS}% - 1px)`,
            transform: `translateZ(0) scale(${pulse})`,
            boxShadow: '0 0 12px hsla(100, 100%, 60%, 1)',
            zIndex: 5,
          }}
        />
      );
    }

    return cells;
  }, [snake, food, foodVisible, justAteTick, direction]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="snake-modal fixed inset-0 z-[9999] h-[100dvh] w-full bg-[#120F0D] text-[#EFE4CF] flex flex-col justify-between p-3.5 sm:p-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] overflow-hidden select-none"
        >
          {/* Header */}
          <div className="w-full max-w-md mx-auto flex items-center justify-between py-1.5 border-b border-[#C6A477]/20 shrink-0">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#191512] border border-[#C6A477]/40 text-[10px] font-bold uppercase tracking-wide text-[#EFE4CF] active:scale-95 transition-all"
            >
              <ArrowLeft className="h-4 w-4 text-[#C6A477]" />
              <span>Back to home</span>
            </button>

            <div className="flex items-center gap-2">
              {isPlaying && !isGameOver && (
                <button
                  onClick={togglePause}
                  className="inline-flex items-center gap-1 rounded-full border border-[#C6A477]/40 bg-[#8C5138]/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#C6A477] active:scale-95"
                >
                  {isPaused ? (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Pause className="h-3.5 w-3.5" />
                  )}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-300 active:scale-95"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Board */}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-2">
            <div className="score">{score}</div>

            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="stage"
            >
              {boardCells}

              {(!isPlaying || isPaused || isGameOver) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px]">
                  {isGameOver ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <h4 className="text-xl font-extrabold text-white">Game Over!</h4>
                      <p className="mt-1 text-xs text-gray-400">
                        Final score:{' '}
                        <span className="text-[#C6A477] font-bold">{score}</span>
                      </p>
                      <button
                        onClick={resetGame}
                        className="mt-4 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] px-6 py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-white active:scale-95"
                      >
                        Play again
                      </button>
                    </motion.div>
                  ) : isPaused ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <h4 className="text-xl font-extrabold text-white">Paused</h4>
                      <button
                        onClick={togglePause}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] px-5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white active:scale-95"
                      >
                        <Play className="h-4 w-4 fill-current" /> Resume
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <h4 className="text-lg font-extrabold text-white">Ready?</h4>
                      <p className="mt-1 text-xs text-gray-400">Swipe to move</p>
                      <button
                        onClick={resetGame}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8C5138] to-[#C6A477] px-5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-white active:scale-95"
                      >
                        <Play className="h-4 w-4 fill-current" /> Start
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mx-auto w-full max-w-md pt-2">
            <button
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] py-2.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-lg active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Exit game to main menu</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};