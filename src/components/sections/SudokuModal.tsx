import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, RotateCcw, Lightbulb, Eraser, Trophy, Play } from 'lucide-react';

interface SudokuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

// Sample 9x9 Sudoku Boards
const INITIAL_BOARDS: Record<Difficulty, (number | null)[][]> = {
  easy: [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ],
  medium: [
    [null, null, null, null, null, null, null, null, null],
    [null, 1, 2, null, 3, 4, 5, 6, 7],
    [null, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [null, null, 9, 1, 2, 3, 4, 5, 6],
    [null, null, null, 4, 5, 6, 7, 8, 9],
    [null, null, null, null, 8, 9, 1, 2, 3],
    [null, null, null, null, null, 2, 3, 4, 5],
    [null, null, null, null, null, null, 6, 7, 8],
  ],
  hard: [
    [8, null, null, null, null, null, null, null, null],
    [null, null, 3, 6, null, null, null, null, null],
    [null, 7, null, null, 9, null, 2, null, null],
    [null, 5, null, null, null, 7, null, null, null],
    [null, null, null, null, 4, 5, 7, null, null],
    [null, null, null, 1, null, null, null, 3, null],
    [null, null, 1, null, null, null, null, 6, 8],
    [null, null, 8, 5, null, null, null, 1, null],
    [null, 9, null, null, null, null, 4, null, null],
  ],
};

export const SudokuModal: React.FC<SudokuModalProps> = ({ isOpen, onClose }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<(number | null)[][]>(INITIAL_BOARDS.easy);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [hintsLeft, setHintsLeft] = useState<number>(3);
  const [isWon, setIsWon] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    setBoard(INITIAL_BOARDS[diff].map((row) => [...row]));
    setSelectedCell(null);
    setIsWon(false);
  };

  const handleNumberClick = (num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (INITIAL_BOARDS[difficulty][row][col] !== null) return; // Cannot overwrite initial given numbers

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? num : c))
    );
    setBoard(newBoard);

    // Check if board is complete (no nulls)
    const isComplete = newBoard.every((r) => r.every((cell) => cell !== null));
    if (isComplete) {
      setIsWon(true);
    }
  };

  const handleErase = () => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (INITIAL_BOARDS[difficulty][row][col] !== null) return;

    const newBoard = board.map((r, rIdx) =>
      r.map((c, cIdx) => (rIdx === row && cIdx === col ? null : c))
    );
    setBoard(newBoard);
  };

  const handleReset = () => {
    setBoard(INITIAL_BOARDS[difficulty].map((row) => [...row]));
    setSelectedCell(null);
    setIsWon(false);
  };

  const handleHint = () => {
    if (hintsLeft <= 0 || !selectedCell) return;
    const [row, col] = selectedCell;
    if (board[row][col] !== null) return;

    // Provide hint (dummy hint for demo)
    const solvedNum = Math.floor(Math.random() * 9) + 1;
    handleNumberClick(solvedNum);
    setHintsLeft((prev) => prev - 1);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-sm glass-3d-card rounded-3xl p-5 relative border border-[#C6A477]/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#C6A477]/20">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C5138] to-[#4A2E1D] flex items-center justify-center border border-[#C6A477]/30 shadow-md">
                <Gamepad2 className="w-5 h-5 text-[#FFF1D1]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#EFE4CF]">Table Sudoku</h3>
                <p className="text-[11px] text-[#C6A477]">Relax while waiting for your order</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1A1512] border border-[#C6A477]/20 flex items-center justify-center text-[#EFE4CF] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Difficulty Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#120F0D] border border-[#C6A477]/20 mb-3 text-xs">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`py-1.5 rounded-lg capitalize font-bold transition-all ${
                  difficulty === diff
                    ? 'bg-[#8C5138] text-[#FFF1D1] shadow-md shadow-[#8C5138]/40'
                    : 'text-[#EFE4CF]/60 hover:text-[#EFE4CF]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Win Overlay Notice */}
          {isWon && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 mb-3 rounded-2xl bg-gradient-to-r from-[#8C5138] to-[#C6A477] text-[#120F0D] text-center font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Trophy className="w-5 h-5 text-[#FFF1D1]" />
              <span>Congratulations! Sudoku Solved! 🎉</span>
            </motion.div>
          )}

          {/* 9x9 Sudoku Board Grid */}
          <div className="grid grid-cols-9 gap-[1px] bg-[#4A2E1D]/50 p-1.5 rounded-2xl border border-[#C6A477]/30 shadow-inner mb-3">
            {board.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isGiven = INITIAL_BOARDS[difficulty][rIdx][cIdx] !== null;
                const isSelected = selectedCell?.[0] === rIdx && selectedCell?.[1] === cIdx;
                const isSubgridRightBorder = (cIdx + 1) % 3 === 0 && cIdx !== 8;
                const isSubgridBottomBorder = (rIdx + 1) % 3 === 0 && rIdx !== 8;

                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => setSelectedCell([rIdx, cIdx])}
                    className={`aspect-square rounded-md text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#C6A477] text-[#120F0D] ring-2 ring-[#FFF1D1] scale-105 z-10'
                        : isGiven
                        ? 'bg-[#1D1714] text-[#FFF1D1]'
                        : cell !== null
                        ? 'bg-[#8C5138]/30 text-[#C6A477]'
                        : 'bg-[#120F0D]/90 text-[#EFE4CF]/40 hover:bg-[#8C5138]/20'
                    } ${isSubgridRightBorder ? 'mr-[2px]' : ''} ${isSubgridBottomBorder ? 'mb-[2px]' : ''}`}
                  >
                    {cell || ''}
                  </button>
                );
              })
            )}
          </div>

          {/* Action Tools Bar (Undo, Erase, Hint) */}
          <div className="flex justify-between items-center mb-3 px-1 text-xs">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[#EFE4CF]/70 hover:text-[#FFF1D1] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
            <button
              onClick={handleErase}
              className="flex items-center gap-1 text-[#EFE4CF]/70 hover:text-[#FFF1D1] transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" /> Erase
            </button>
            <button
              onClick={handleHint}
              disabled={hintsLeft <= 0}
              className={`flex items-center gap-1 font-semibold transition-colors ${
                hintsLeft > 0 ? 'text-[#C6A477] hover:text-[#FFF1D1]' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Hint ({hintsLeft})
            </button>
          </div>

          {/* 1-9 Numpad Selector */}
          <div className="grid grid-cols-9 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNumberClick(num)}
                className="py-2.5 rounded-xl bg-gradient-to-b from-[#2A201A] to-[#17120F] border border-[#C6A477]/30 text-xs font-bold text-[#FFF1D1] shadow-md hover:border-[#C6A477] transition-all"
              >
                {num}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
