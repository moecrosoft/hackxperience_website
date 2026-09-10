"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat, IBM_Plex_Mono } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
  style: ["normal"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

export default function EasterEggBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Flat Circular Bubble - Responsive Fixed Positioning & Sizing */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Secret Arcade Game Easter Egg"
        className={`${ibmPlexMono.className} fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-50 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#111111] text-white border-2 sm:border-4 border-[#d10000] hover:bg-[#d10000] hover:text-black transition-colors cursor-pointer select-none`}
      >
        <span className="text-lg sm:text-2xl">👾</span>
      </button>

      {/* Game Placeholder Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div
            className={`${ibmPlexMono.className} relative w-full max-w-lg border-2 sm:border-4 border-[#d10000] bg-[#111111] p-5 xs:p-6 sm:p-9 text-white shadow-[8px_8px_0_0_#d10000] sm:shadow-[16px_16px_0_0_#d10000] max-h-[90vh] overflow-y-auto`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center border-2 border-white/40 text-xs sm:text-sm font-extrabold text-white/80 hover:border-white hover:text-white hover:bg-white/10 transition-all cursor-pointer z-10"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Title with Red Dot Aligned Inline */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pr-6 sm:pr-8">
              <span className="relative flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d10000] opacity-90" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-[#d10000]" />
              </span>
              <h3
                className={`${montserrat.className} text-[15px] xs:text-[18px] sm:text-[24px] font-extrabold uppercase leading-none tracking-tight text-[#d10000]`}
              >
                // SECRET GAME CHALLENGE
              </h3>
            </div>

            {/* Image Box */}
            <div className="relative w-full aspect-video mb-4 sm:mb-5 border-2 sm:border-4 border-[#d10000] bg-black overflow-hidden flex items-center justify-center p-1">
              <Image
                src="/puspak.jpg"
                alt="Arcade Challenge Preview"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Responsive Instructions */}
            <ul className="space-y-2 sm:space-y-2.5 text-[12px] sm:text-[14px] text-[#d10000] font-medium">
              <li className="sm:whitespace-nowrap overflow-hidden text-ellipsis">&gt; Find Puspak and take a selfie.</li>
              <li className="sm:whitespace-nowrap overflow-hidden text-ellipsis">&gt; Send the photo inside the hackathon group chat.</li>
              <li className="sm:whitespace-nowrap overflow-hidden text-ellipsis">&gt; The first three to send will win a surprise gift!</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}