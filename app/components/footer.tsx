"use client";

import { useState } from "react";
import { IBM_Plex_Mono, Montserrat } from "next/font/google";
import { TELEGRAM_URL } from "@/lib/site-links";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["800", "900"],
});

type ShareModalState = {
  isOpen: boolean;
  platform: "LinkedIn" | "Instagram" | null;
  message: string;
  targetUrl: string;
};

export default function Footer() {
  const [modal, setModal] = useState<ShareModalState>({
    isOpen: false,
    platform: null,
    message: "",
    targetUrl: "",
  });

  const shareTitle = "HACKXPERIENCE 2026 — AI for Living";
  const shareSubtitle =
    "Building agentic products with 100+ student builders at SIM IT Club's flagship 24-hour hackathon!";
  const shareHashtags = "#HackXperience2026 #SIMITClub";

  // Pure caption text
  const shareText = `${shareTitle}\n\n${shareSubtitle}\n\n${shareHashtags}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const isMobileDevice = () => {
    return (
      typeof window !== "undefined" &&
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    );
  };

  const handleShareClick = async (
    platform: "LinkedIn" | "Instagram",
    targetUrl: string
  ) => {
    // Copy text to clipboard immediately on button tap
    await copyToClipboard();

    setModal({
      isOpen: true,
      platform,
      message:
        platform === "Instagram"
          ? "Captions copied to clipboard! Tap Proceed to open Instagram."
          : "Captions copied to clipboard! Tap Proceed to share directly to LinkedIn.",
      targetUrl,
    });
  };

  const handleProceed = async () => {
    const { platform, targetUrl } = modal;

    setModal({
      isOpen: false,
      platform: null,
      message: "",
      targetUrl: "",
    });

    if (isMobileDevice()) {
      // 1. LinkedIn on Mobile: Trigger System Share Sheet with text pre-filled into LinkedIn App
      if (platform === "LinkedIn") {
        if (typeof navigator !== "undefined" && "share" in navigator) {
          try {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: window.location.href, // or your campaign URL
            });
            return;
          } catch (err) {
            // User cancelled share sheet or error occurred
            if ((err as Error).name === "AbortError") return;
          }
        }
      }

      // 2. Instagram on Mobile: Direct deep link trigger into Instagram app
      if (platform === "Instagram") {
        window.location.href = "instagram://app";
        setTimeout(() => {
          window.location.href = "https://www.instagram.com/";
        }, 1200);
        return;
      }
    }

    // 3. Desktop fallback: Open platform web application in a new tab
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  const handleLinkedInShare = () => {
    const encodedText = encodeURIComponent(shareText);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.href : "https://simitclub.com"
    )}&summary=${encodedText}`;
    handleShareClick("LinkedIn", linkedinUrl);
  };

  const handleInstagramShare = () => {
    handleShareClick("Instagram", "https://www.instagram.com/");
  };

  return (
    <>
      <footer
        className={`${ibmPlexMono.className} w-full bg-[#1e1e1e] text-[#666] px-6 sm:px-10 md:px-14 pt-14 sm:pt-20 pb-10 sm:pb-14`}
      >
        <div className="mx-auto max-w-7xl">
          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-0">
            {/* Left — branding */}
            <div className="md:w-[40%]">
              <h3
                className={`${montserrat.className} text-[#c00000] text-[22px] sm:text-[26px] font-extrabold tracking-tight leading-none uppercase`}
              >
                HACKXPERIENCE_2026
              </h3>
              <p className="mt-5 text-[13px] sm:text-[14px] leading-[1.75] tracking-[0.01em] max-w-[380px]">
                SIM IT Club&apos;s flagship hackathon. 100+ student builders, one
                24-hour sprint, agentic products built under the theme{" "}
                <span className="text-[#c00000]">AI for Living</span>.
              </p>
            </div>

            {/* Middle — contact */}
            <div className="md:w-[25%]">
              <div className="text-[#c00000] text-[12px] sm:text-[13px] font-bold tracking-[0.10em] uppercase mb-5">
                // CONTACT_CELL
              </div>
              <div className="text-[13px] sm:text-[14px] leading-[1.75] tracking-[0.02em]">
                <div>it@mymail.sim.edu.sg</div>
                <div className="mt-3">
                  SIM 461 Clementi Road,
                  <br />
                  Singapore 599491
                </div>
              </div>
            </div>

            {/* Right — networks */}
            <div className="md:w-[15%]">
              <div className="text-[#c00000] text-[12px] sm:text-[13px] font-bold tracking-[0.10em] uppercase mb-5">
                // NETWORKS
              </div>
              <div className="flex flex-col gap-2.5 text-[13px] sm:text-[14px] tracking-[0.04em]">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-[#555] hover:text-white hover:decoration-[#c00000] transition-colors w-fit cursor-pointer"
                >
                  TELEGRAM
                </a>
                <a
                  href="https://www.linkedin.com/company/sim-information-technology-club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-[#555] hover:text-white hover:decoration-[#c00000] transition-colors w-fit cursor-pointer"
                >
                  LINKEDIN
                </a>
                <a
                  href="https://www.instagram.com/simitclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 decoration-[#555] hover:text-white hover:decoration-[#c00000] transition-colors w-fit cursor-pointer"
                >
                  INSTAGRAM
                </a>
              </div>
            </div>

            {/* Share your experience */}
            <div className="md:w-[20%]">
              <div className="text-[#c00000] text-[12px] sm:text-[13px] font-bold tracking-[0.10em] uppercase mb-5">
                // SHARE YOUR EXPERIENCE
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleLinkedInShare}
                  className="w-full border border-[#444] px-4 py-2.5 text-left text-[12px] sm:text-[13px] tracking-[0.06em] text-[#777] hover:border-[#c00000] hover:text-white transition-colors cursor-pointer"
                >
                  LINKEDIN
                </button>

                <button
                  type="button"
                  onClick={handleInstagramShare}
                  className="w-full border border-[#444] px-4 py-2.5 text-left text-[12px] sm:text-[13px] tracking-[0.06em] text-[#777] hover:border-[#c00000] hover:text-white transition-colors cursor-pointer"
                >
                  INSTAGRAM
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#333] mt-16 sm:mt-24 mb-6 sm:mb-8" />

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 text-[10px] sm:text-[11px] tracking-[0.08em] uppercase text-[#444]">
            <div>
              &copy; 2026 SIM IT CLUB · HACKXPERIENCE. ALL RIGHTS RESERVED.
            </div>
            <div>BUILT BY SIM IT CLUB · #HACKXPERIENCE2026</div>
          </div>
        </div>
      </footer>

      {/* Proceed Modal (Renders on Desktop & Mobile) */}
      {modal.isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 ${ibmPlexMono.className}`}
        >
          <div className="w-full max-w-md border border-[#333] bg-[#1e1e1e] p-6 shadow-2xl">
            <div className="text-[#c00000] text-[12px] font-bold tracking-[0.10em] uppercase mb-3">
              // SHARE_STATUS
            </div>
            <p className="text-[#ccc] text-[13px] sm:text-[14px] leading-[1.6] mb-6">
              {modal.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setModal({
                    isOpen: false,
                    platform: null,
                    message: "",
                    targetUrl: "",
                  })
                }
                className="border border-[#444] px-4 py-2 text-[12px] tracking-[0.06em] text-[#888] hover:border-[#666] hover:text-white transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className="bg-[#c00000] px-5 py-2 text-[12px] font-semibold tracking-[0.06em] text-white hover:bg-[#a00000] transition-colors cursor-pointer uppercase inline-block text-center"
              >
                PROCEED
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}