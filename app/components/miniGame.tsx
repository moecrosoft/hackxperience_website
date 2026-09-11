"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IBM_Plex_Mono, Montserrat } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  style: ["normal", "italic"],
});

const EXTENDED_SYMBOLS = ["⚡", "💾", "🤖", "🔥", "👾", "🌐", "🔑", "💻"];

interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MiniGame({ isOpen, onClose }: MiniGameModalProps) {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const initGame = () => {
    const fullDeck = [...EXTENDED_SYMBOLS, ...EXTENDED_SYMBOLS].sort(() => Math.random() - 0.5);
    setCards(fullDeck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setCombo(0);
    setScore(0);
    setTimer(0);
    setGameActive(true);
  };

  // Re-initialize deck whenever modal opens
  useEffect(() => {
    if (isOpen) {
      initGame();
    }
  }, [isOpen]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && isOpen && matched.length < cards.length && cards.length > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, isOpen, matched.length, cards.length]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        setScore((s) => s + 100 * newCombo);
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
      } else {
        setCombo(0);
        setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop Blur/Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`relative z-10 w-full max-w-md sm:max-w-lg bg-[#0a0a0a] border-2 border-[#d10000] text-white shadow-[0_0_25px_rgba(209,0,0,0.3)] flex flex-col overflow-hidden max-h-[90dvh] ${ibmPlexMono.className}`}
          >
            {/* Modal Header with Bigger & Brighter Centered Title */}
            <div className="relative w-full bg-[#141414] border-b-2 border-[#d10000] px-4 py-3.5 flex items-center justify-center shrink-0">
              <div className="flex items-center justify-center gap-2.5">
                <span className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-[#ff0000] shadow-[0_0_10px_#ff0000] animate-pulse" />
                <h3
                  className={`${montserrat.className} text-xl sm:text-3xl font-black tracking-widest uppercase text-white drop-shadow-[0_0_12px_rgba(255,0,0,0.8)]`}
                >
                  <span className="text-white">MINI </span>
                  <span className="text-[#ff1a1a]">GAME</span>
                </h3>
              </div>

              {/* Styled Cyberpunk X Box Button */}
              <button
                onClick={onClose}
                aria-label="Close Mini Game"
                className="absolute right-3 sm:right-4 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-[#1d1c17] border border-[#d10000] text-[#ff4d4d] font-bold text-base sm:text-lg hover:bg-[#d10000] hover:text-white transition-all duration-150 cursor-pointer shadow-[2px_2px_0_0_#d10000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 flex flex-col items-center gap-4 overflow-y-auto">
              {/* Game HUD */}
              <div className="w-full grid grid-cols-4 gap-1.5 border border-[#d10000]/60 bg-[#141414] p-2 text-center shadow-[2px_2px_0_0_#330000]">
                <div className="p-0.5">
                  <div className="text-[8px] sm:text-[9px] text-white/60 tracking-widest uppercase">TIME</div>
                  <div className="text-xs sm:text-base font-bold text-white">{timer}s</div>
                </div>
                <div className="p-0.5">
                  <div className="text-[8px] sm:text-[9px] text-white/60 tracking-widest uppercase">MOVES</div>
                  <div className="text-xs sm:text-base font-bold text-white">{moves}</div>
                </div>
                <div className="p-0.5">
                  <div className="text-[8px] sm:text-[9px] text-white/60 tracking-widest uppercase">COMBO</div>
                  <div className="text-xs sm:text-base font-bold text-[#ff4d4d]">{combo}x</div>
                </div>
                <div className="p-0.5">
                  <div className="text-[8px] sm:text-[9px] text-white/60 tracking-widest uppercase">SCORE</div>
                  <div className="text-xs sm:text-base font-bold text-[#ff4d4d]">{score}</div>
                </div>
              </div>

              {/* 16-Card Grid */}
              <div className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[340px] aspect-square my-1">
                <div className="grid grid-cols-4 grid-rows-4 gap-2 w-full h-full">
                  {cards.map((symbol, idx) => {
                    const isFlipped = flipped.includes(idx) || matched.includes(idx);
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: isFlipped ? 1 : 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCardClick(idx)}
                        className={`aspect-square w-full border-2 flex items-center justify-center text-xl xs:text-2xl transition-all cursor-pointer font-bold ${
                          isFlipped
                            ? "border-[#d10000] bg-[#1d1c17] text-white shadow-[2px_2px_0_0_#d10000]"
                            : "border-white/20 bg-[#141414] text-transparent hover:border-[#ff4d4d]"
                        }`}
                      >
                        {isFlipped ? symbol : "?"}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Action / Win Banner */}
              <div className="w-full flex justify-center">
                {matched.length === cards.length && cards.length > 0 ? (
                  <div className="w-full text-center p-3 border-2 border-[#d10000] bg-[#1d1c17] shadow-[3px_3px_0_0_#d10000]">
                    <h4 className={`${montserrat.className} text-sm sm:text-base font-bold text-[#ff4d4d] uppercase mb-0.5`}>
                      SYSTEM PURGED!
                    </h4>
                    <p className="text-[10px] sm:text-xs text-white/80 mb-2">
                      Score: <span className="font-bold text-white">{score}</span> | Time:{" "}
                      <span className="font-bold text-white">{timer}s</span> | Moves:{" "}
                      <span className="font-bold text-white">{moves}</span>
                    </p>
                    <button
                      onClick={initGame}
                      className="bg-[#d10000] hover:bg-[#b00000] text-white px-5 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer shadow-[2px_2px_0_0_#000]"
                    >
                      PLAY AGAIN
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={initGame}
                    className="border border-white/20 hover:border-white/60 text-white/80 px-4 py-1.5 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                  >
                    RESTART MATRIX
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}