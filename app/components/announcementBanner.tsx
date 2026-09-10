"use client";

import { useState } from "react";
import { IBM_Plex_Mono, Montserrat } from "next/font/google";
import { motion, useReducedMotion } from "framer-motion";

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

const HAS_REMINDER = true;

const ANNOUNCEMENT_CONFIG = {
  title: "SUBMISSION DEADLINE IN 30 MINS!",
  subtitle: "Submissions are closing in 30 mins!",
};

const ANNOUNCEMENT_ID = `${ANNOUNCEMENT_CONFIG.title}::${ANNOUNCEMENT_CONFIG.subtitle}`;

// High-intensity persistent baseline glow
const BASE_FILTER =
  "drop-shadow(0px 0px 10px rgba(209,0,0,1)) drop-shadow(0px 0px 25px rgba(209,0,0,0.8))";

// Ultra-bright peak surge at top of floating arc
const PEAK_FILTER =
  "drop-shadow(0px 0px 24px rgba(255,40,40,1)) drop-shadow(0px 0px 60px rgba(209,0,0,1))";

export default function AnnouncementBanner() {
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const isDismissed = dismissedId === ANNOUNCEMENT_ID;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedId(ANNOUNCEMENT_ID);
  };

  if (!HAS_REMINDER || isDismissed) return null;

  return (
    <motion.aside
      key={ANNOUNCEMENT_ID}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { y: 0, opacity: 0, scale: 1, filter: BASE_FILTER }
      }
      animate={
        reduceMotion
          ? { opacity: 1, filter: BASE_FILTER }
          : {
              y: [0, -16, 0], // Sightly dampened peak height for mobile edge safety
              scale: [1, 1.03, 1],
              opacity: [1, 1, 1],
              filter: [BASE_FILTER, PEAK_FILTER, BASE_FILTER],
            }
      }
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : {
              duration: 2.2,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }
      }
      className={`${ibmPlexMono.className} fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-lg bg-[#111111] text-white border-2 sm:border-4 border-[#d10000] shadow-[8px_8px_0_0_#d10000] sm:shadow-[16px_16px_0_0_#d10000] p-5 sm:p-8 select-none origin-bottom-right`}
    >
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center border-2 border-white/40 text-xs sm:text-sm font-extrabold text-white/80 hover:border-white hover:text-white hover:bg-white/10 transition-all cursor-pointer z-10"
        aria-label="Dismiss banner"
      >
        ✕
      </button>

      {/* Banner Body */}
      <div className="pr-6 sm:pr-8">
        {/* Header Pulsing Dot */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-2 sm:mb-3">
          <span className="relative flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d10000] opacity-90" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-[#d10000]" />
          </span>
          <span
            className={`${montserrat.className} text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-[#d10000]`}
          >
            // REMINDER
          </span>
        </div>

        {/* Title */}
        <h3
          className={`${montserrat.className} text-[18px] xs:text-[22px] sm:text-[28px] md:text-[32px] font-extrabold uppercase leading-[1.05] sm:leading-[0.98] tracking-tight text-white`}
        >
          {ANNOUNCEMENT_CONFIG.title}
        </h3>

        {/* Subtitle */}
        <p className="mt-2 sm:mt-3.5 text-[12px] sm:text-[15px] leading-relaxed font-normal text-white/90">
          {ANNOUNCEMENT_CONFIG.subtitle}
        </p>
      </div>
    </motion.aside>
  );
}