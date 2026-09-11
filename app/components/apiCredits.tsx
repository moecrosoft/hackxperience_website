"use client";

import { useState } from "react";
import Image from "next/image";
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

type ProviderId = "microsoft" | "openai" | "claude";

interface CreditProvider {
  id: ProviderId;
  name: string;
  logoSrc: string;
  instructions: string[];
}

const CREDIT_PROVIDERS: CreditProvider[] = [
  {
    id: "microsoft",
    name: "Microsoft Azure",
    logoSrc: "/microsoft.svg",
    instructions: [
      "Join the Microsoft Foundry workshop on 17 July 2026 or check your registered email for the exclusive activation key.",
      "Navigate to the Azure AI Foundry portal and sign in with your student Microsoft account.",
      "Select 'Redeem Credit Code' under Subscription Settings and input your team's code.",
      "Deploy your agent deployments using Azure OpenAI deployments (GPT-4o / Azure AI Search).",
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    logoSrc: "/openai.png",
    instructions: [
      "Log into your OpenAI Platform dashboard using your hackathon team's primary account.",
      "Go to Settings > Organization > Billing and click 'Redeem Promo Code'.",
      "Enter the OpenAI promo code provided in your HackXperience registration packet.",
      "Set your billing soft limit and export OPENAI_API_KEY into your team's .env.local file.",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    logoSrc: "/claude.svg",
    instructions: [
      "Access the Anthropic Console using your hackathon team email.",
      "Select 'Plans & Billing' and navigate to the Credits section.",
      "Claim your assigned workshop credits token issued by the SIM IT Club event admins.",
      "Generate an API key with standard permissions and test your connections via Workbench.",
    ],
  },
];

export default function ApiCreditsCta() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeInstructionProvider, setActiveInstructionProvider] = useState<ProviderId | null>(null);
  const reduceMotion = useReducedMotion();

  const handleOpenModal = () => {
    setActiveInstructionProvider(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveInstructionProvider(null);
  };

  const selectedProviderData = CREDIT_PROVIDERS.find((p) => p.id === activeInstructionProvider);

  return (
    <>
      {/* Section CTA */}
      <section
        id="api-credits"
        className={`${ibmPlexMono.className} w-full bg-[#121212] text-white scroll-mt-11 overflow-hidden relative border-t-2 border-[#d10000]/80`}
      >
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 md:px-10 py-16 sm:py-24 md:py-32">
          <RevealItem>
            <h2
              onClick={handleOpenModal}
              className={`${montserrat.className} text-center uppercase text-[36px] xs:text-[44px] sm:text-[68px] md:text-[88px] font-black leading-[0.95] tracking-tight text-white transition-colors hover:text-white/90 cursor-pointer`}
            >
              API <span className="text-[#d10000]">CREDITS.</span>
            </h2>
          </RevealItem>

          <RevealItem>
            <p className="mx-auto mt-4 sm:mt-6 max-w-[580px] text-center italic text-[13px] xs:text-[15px] sm:text-[17px] leading-[1.55] font-normal tracking-[0.02em] text-white/70">
              Claim your API credits and sponsor resources for HackXperience 2026.
            </p>
          </RevealItem>

          <RevealStagger
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            stagger={0.1}
          >
            <RevealItem className="w-full sm:w-auto">
              <motion.button
                onClick={handleOpenModal}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { y: 1, scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full sm:w-auto bg-[#d10000] text-white px-6 sm:px-12 py-3.5 sm:py-5 text-[12px] sm:text-[15px] font-bold tracking-[0.12em] uppercase shadow-[4px_4px_0_0_#330000] sm:shadow-[5px_5px_0_0_#330000] hover:bg-[#b00000] transition-colors cursor-pointer border border-[#ff4d4d]/30"
              >
                CLAIM YOUR API CREDITS
              </motion.button>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* Full-Page Responsive Modal Overlay */}
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
            <div className="w-full bg-[#141414] border-b-2 border-[#d10000] px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 truncate pr-2">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff4d4d] animate-pulse shrink-0" />
                <h3 className={`${montserrat.className} text-sm xs:text-base sm:text-xl font-bold tracking-wider uppercase text-white truncate`}>
                  {activeInstructionProvider ? selectedProviderData?.name : "SPONSOR API CREDITS"}
                </h3>
              </div>

              {/* Close Modal Button */}
              <button
                onClick={handleCloseModal}
                aria-label="Close API Credits Hub"
                className="group flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <span>[ CLOSE ]</span>
                <span className="text-base sm:text-xl leading-none text-[#ff4d4d] group-hover:rotate-90 transition-transform duration-200">
                  ✕
                </span>
              </button>
            </div>

            {/* Scrollable Modal Body Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 max-w-6xl mx-auto w-full flex flex-col justify-start sm:justify-center">
              {!activeInstructionProvider ? (
                /* STEP 1: Responsive Grid for Provider Cards */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full my-auto py-2">
                  {CREDIT_PROVIDERS.map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() => setActiveInstructionProvider(provider.id)}
                      className="border-2 border-[#d10000]/60 bg-[#141414] p-5 sm:p-8 transition-all cursor-pointer shadow-[4px_4px_0_0_#330000] sm:shadow-[6px_6px_0_0_#330000] hover:shadow-[6px_6px_0_0_#d10000] hover:border-[#d10000] flex flex-col items-center justify-between text-center min-h-[220px] sm:min-h-[260px]"
                    >
                      <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex items-center justify-center">
                          <Image
                            src={provider.logoSrc}
                            alt={`${provider.name} Logo`}
                            width={64}
                            height={64}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        <h4 className={`${montserrat.className} text-base sm:text-xl font-bold tracking-tight uppercase text-white`}>
                          {provider.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInstructionProvider(provider.id);
                        }}
                        className="w-full mt-4 sm:mt-6 bg-[#d10000] hover:bg-[#b00000] text-white py-2.5 sm:py-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] border border-[#ff4d4d]/30"
                      >
                        CLAIM
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* STEP 2: Instructions View */
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedProviderData?.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="relative border-2 border-[#d10000] bg-[#141414] p-4 sm:p-8 md:p-10 shadow-[4px_4px_0_0_#d10000] sm:shadow-[8px_8px_0_0_#d10000] w-full my-auto"
                  >
                    {/* Return to Cards [X] Button */}
                    <button
                      onClick={() => setActiveInstructionProvider(null)}
                      aria-label="Back to providers list"
                      className="absolute top-3 right-3 sm:top-6 sm:right-6 group flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/70 hover:text-[#ff4d4d] transition-colors cursor-pointer"
                    >
                      <span>[ BACK ]</span>
                    </button>

                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-white/10 pr-16 sm:pr-20">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 relative flex-shrink-0">
                        <Image
                          src={selectedProviderData?.logoSrc || ""}
                          alt={`${selectedProviderData?.name} Logo`}
                          width={48}
                          height={48}
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                      <div>
                        <h4 className={`${montserrat.className} text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight text-white`}>
                          {selectedProviderData?.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-[#ff4d4d] font-bold tracking-wider uppercase mt-0.5 sm:mt-1">
                          // INSTRUCTIONS TO CLAIM CREDITS
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/90 leading-relaxed">
                      {selectedProviderData?.instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3">
                          <span className="text-[#ff4d4d] font-bold shrink-0 text-[11px] sm:text-xs pt-0.5">
                            &gt; STEP {idx + 1}:
                          </span>
                          <span className="flex-1">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}