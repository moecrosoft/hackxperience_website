"use client";

import { useState, useEffect } from "react";
import { IBM_Plex_Mono, Montserrat } from "next/font/google";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RevealItem, RevealStagger } from "./ui/motion-ui";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  style: ["normal", "italic"],
});

type Message = {
  id: number;
  name: string;
  text: string;
  createdAt: number;
};

// Helper for relative time formatting ("... ago")
function getRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 30) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityWallCta() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const reduceMotion = useReducedMotion();

  // Empty state - zero pre-filled messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setTick] = useState(0);

  // Periodic ticker to keep "... ago" timestamps fresh automatically
  useEffect(() => {
    if (!isModalOpen || messages.length === 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, [isModalOpen, messages.length]);

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      createdAt: Date.now(),
    };

    setMessages([newMessage, ...messages]);
    setName("");
    setText("");
    setIsFormOpen(false);
  };

  return (
    <>
      {/* Section CTA */}
      <section
        id="community-wall"
        className={`${ibmPlexMono.className} w-full bg-[#121212] text-white scroll-mt-11 overflow-hidden relative border-t-2 border-[#d10000] cursor-pointer`}
      >
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 md:px-10 py-16 sm:py-28 md:py-36">
          <RevealItem>
            <h2
              className={`${montserrat.className} text-center uppercase text-[38px] xs:text-[50px] sm:text-[76px] md:text-[96px] font-extrabold leading-[0.95] tracking-[-0.02em] text-white cursor-pointer`}
              onClick={() => setIsModalOpen(true)}
            >
              COMMUNITY <span className="text-[#d10000]">WALL.</span>
            </h2>
          </RevealItem>

          <RevealItem>
            <p className="mx-auto mt-4 sm:mt-8 max-w-[560px] text-center italic text-[13px] xs:text-[15px] sm:text-[17px] leading-[1.55] font-normal tracking-[0.02em] text-white/70">
              Share your thoughts, feelings and experiences.
            </p>
          </RevealItem>

          <RevealStagger
            className="mt-8 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            stagger={0.1}
          >
            <RevealItem className="w-full sm:w-auto">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { y: 1, scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto bg-[#d10000] text-white px-8 sm:px-14 py-4 sm:py-5 text-[12px] sm:text-[15px] font-bold tracking-[0.12em] uppercase shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] sm:shadow-[5px_5px_0_0_rgba(255,255,255,0.2)] hover:bg-[#b00000] transition-colors cursor-pointer"
              >
                OPEN COMMUNITY WALL
              </motion.button>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* Full-Page Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-[9999] h-dvh w-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden ${ibmPlexMono.className}`}
          >
            {/* Modal Header */}
            <div className="w-full bg-[#121212] border-b border-[#d10000] px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 truncate pr-2">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#d10000] animate-pulse shrink-0" />
                <h3 className={`${montserrat.className} text-sm xs:text-base sm:text-xl font-bold tracking-wider uppercase truncate`}>
                  COMMUNITY WALL
                </h3>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Community Wall"
                className="group flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <span>[ CLOSE ]</span>
                <span className="text-base sm:text-xl leading-none text-[#d10000] group-hover:rotate-90 transition-transform duration-200">
                  ✕
                </span>
              </button>
            </div>

            {/* Scrollable Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full relative">
              {messages.length === 0 ? (
                <div className="h-full min-h-[45vh] sm:min-h-[50vh] flex flex-col items-center justify-center text-center p-6 sm:p-8 border border-white/10 rounded bg-[#121212]">
                  <p className="text-[#d10000] font-bold text-xs sm:text-sm tracking-widest uppercase mb-2">
                    // THE WALL IS EMPTY
                  </p>
                  <p className="text-white/60 text-[11px] sm:text-xs tracking-wider max-w-xs sm:max-w-none">
                    Click the <span className="text-[#d10000] font-bold">+</span> button below to submit the first post!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-28">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        reduceMotion
                          ? { opacity: 1, y: 0 }
                          : {
                              opacity: 1,
                              y: [0, index % 2 === 0 ? -6 : 6, 0],
                            }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0.2 }
                          : {
                              y: {
                                duration: 4 + (index % 3),
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }
                      }
                      className="border-2 border-[#d10000] bg-[#121212] p-4 sm:p-6 shadow-[4px_4px_0_0_#d10000] sm:shadow-[5px_5px_0_0_#d10000] hover:shadow-[7px_7px_0_0_#d10000] transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-2 sm:pb-3 mb-2 sm:mb-3">
                          <span className="font-bold text-[#d10000] text-xs sm:text-sm uppercase truncate pr-2">
                            @{msg.name}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-white/50 shrink-0">
                            {getRelativeTime(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                          {msg.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Floating Control Panel */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
              <AnimatePresence>
                {isFormOpen && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onSubmit={handlePostMessage}
                    className="bg-[#121212] border-2 border-[#d10000] p-4 sm:p-5 shadow-[6px_6px_0_0_#d10000] sm:shadow-[8px_8px_0_0_#d10000] w-[calc(100vw-2rem)] max-w-sm sm:w-96 flex flex-col gap-2.5 sm:gap-3"
                  >
                    <div className="text-[10px] sm:text-xs font-bold tracking-wider text-[#d10000] uppercase mb-0.5">
                      // SHARE YOUR THOUGHTS
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name / Handle"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 p-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d10000]"
                      required
                    />
                    <textarea
                      placeholder="What are you building or looking for?"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={3}
                      className="w-full bg-black/60 border border-white/20 p-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#d10000] resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#d10000] hover:bg-[#b00000] text-white font-bold py-2 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-widest transition-colors cursor-pointer border border-white/10"
                    >
                      POST MESSAGE
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Floating Action Button */}
              <motion.button
                onClick={() => setIsFormOpen(!isFormOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-[#d10000] text-white text-2xl sm:text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(209,0,0,0.5)] border-2 border-white hover:bg-[#b00000] transition-colors cursor-pointer shrink-0"
                aria-label="Add Message"
              >
                <motion.span
                  animate={{ rotate: isFormOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}