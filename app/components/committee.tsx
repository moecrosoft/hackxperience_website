"use client";

import { useRef, useState, type MouseEvent } from "react";
import { IBM_Plex_Mono, Montserrat } from "next/font/google";
import { useReducedMotion } from "framer-motion";
import { RevealItem, RevealStagger } from "./ui/motion-ui";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

interface Member {
  role: string;
  name: string;
  img: string | null;
  linkedinUrl?: string;
  frame?: "full" | "medium" | "tight";
  scale?: number;
  objectPosition?: string;
}

interface Team {
  label: string;
  members: Member[];
}

const PHOTO_FRAMES = {
  full: { scale: 1.72, objectPosition: "50% 36%" },
  medium: { scale: 1.1, objectPosition: "50% 42%" },
  tight: { scale: 1, objectPosition: "50% 46%" },
} as const;

function LinkedInButton({ member }: { member: Member }) {
  const href = member.linkedinUrl?.trim();
  if (!href) return null;

  return (
    <div
      className="absolute bottom-2.5 right-2.5 z-20 pointer-events-auto"
      style={{ transform: "translateZ(30px)" }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 bg-[#1f1f1f]/90 hover:bg-[#d10000] text-white/80 hover:text-white flex justify-center items-center rounded-sm border border-[#d10000]/60 shadow-[2px_2px_0_0_rgba(209,0,0,0.4)] transition-colors duration-200 cursor-pointer"
        aria-label={`${member.name} LinkedIn`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
          <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.34 9.89H5.65V18H8.34V9.89ZM6.99 5.6A1.56 1.56 0 1 0 6.99 8.72A1.56 1.56 0 0 0 6.99 5.6ZM18 13.34C18 10.89 16.69 9.74 14.95 9.74C13.54 9.74 12.91 10.52 12.55 11.07V9.89H9.86V18H12.55V13.98C12.55 12.92 12.75 11.9 14.07 11.9C15.37 11.9 15.39 13.12 15.39 14.05V18H18V13.34Z" />
        </svg>
      </a>
    </div>
  );
}

function MemberPhoto({ member }: { member: Member }) {
  const frame = member.frame ?? "full";
  const { scale: frameScale, objectPosition: framePosition } = PHOTO_FRAMES[frame];
  const scale = member.scale ?? frameScale;
  const objectPosition = member.objectPosition ?? framePosition;

  return (
    <div className="w-full aspect-[3/4] bg-[#141414] border border-[#b30000]/60 overflow-hidden relative [transform-style:preserve-3d] shadow-[3px_3px_0_0_rgba(179,0,0,0.3)] group-hover:shadow-[5px_5px_0_0_rgba(209,0,0,0.5)] group-hover:border-[#d10000] transition-all duration-300">
      {member.img ? (
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-300 pointer-events-none"
          style={{
            objectPosition,
            transform: `scale(${scale})`,
            transformOrigin: objectPosition,
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-white/30 tracking-widest uppercase select-none">
          // NO PHOTO
        </div>
      )}
      <LinkedInButton member={member} />
    </div>
  );
}

function Member3DCard({ member }: { member: Member }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltSurfaceRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return;

    const rect = (tiltSurfaceRef.current ?? cardRef.current).getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxTilt = 8;

    setRotateX(((centerY - y) / centerY) * maxTilt);
    setRotateY(((x - centerX) / centerX) * maxTilt);
  };

  const handleMouseEnter = () => {
    if (reduceMotion) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="w-full group "
      style={{ perspective: "1000px" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div ref={tiltSurfaceRef}>
          <MemberPhoto member={member} />
        </div>
        <div
          className="mt-2.5 text-[10px] sm:text-[11px] font-bold tracking-[0.08em] text-[#d10000] uppercase select-none"
          style={{ transform: "translateZ(20px)" }}
        >
          // {member.role}
        </div>
        <div
          className={`${montserrat.className} mt-0.5 text-[12px] sm:text-[14px] font-bold tracking-tight text-white/90 uppercase group-hover:text-[#d10000] transition-colors select-none`}
          style={{ transform: "translateZ(20px)" }}
        >
          {member.name}
        </div>
      </div>
    </div>
  );
}

const TEAMS: Team[] = [
  {
    label: "EXCO TEAM",
    members: [
      { role: "PRESIDENT", name: "JAYADIPA FUKUTARO", img: "/committee/jayadipa-fukutaro.jpg", linkedinUrl: "https://www.linkedin.com/in/fukutaro/" },
      { role: "VICE PRESIDENT", name: "MICHELLE CHAN", img: "/committee/michelle-chan.jpg", linkedinUrl: "https://www.linkedin.com/in/mchellechan/" },
      { role: "SECRETARY", name: "REYNALDI ARDIANTO WIYOGO", img: "/committee/reynaldi-ardianto.jpg", linkedinUrl: "https://www.linkedin.com/in/reynaldi-ardianto-wiyogo/", frame: "tight" },
      { role: "TECHNICAL DIRECTOR", name: "YAN MEI WONG", img: "/committee/yan-mei-wong.jpg", linkedinUrl: "https://www.linkedin.com/in/wong-yan-mei888/", frame: "tight" },
      { role: "TECHNICAL DIRECTOR", name: "DESMOND", img: "/committee/desmond.jpg", linkedinUrl: "https://www.linkedin.com/in/desmond05/" },
      { role: "MARKETING DIRECTOR", name: "VANNESS YANG", img: "/committee/vanness-yang.jpg", linkedinUrl: "https://www.linkedin.com/in/vanness-yang-53bb31293/" },
      { role: "PARTNERSHIPS DIRECTOR", name: "WINSTON FAUSTIN", img: "/committee/winston-faustin.jpg", linkedinUrl: "https://www.linkedin.com/in/winstonfaustin/" },
    ],
  },
  {
    label: "DEV TEAM",
    members: [
      { role: "SUBCOMMITTEE", name: "LEE HAE EUN CHLOE", img: "/committee/chloe.jpg", linkedinUrl: "https://www.linkedin.com/in/hae-eun-lee-169baa2b2/" },
      { role: "SUBCOMMITTEE", name: "ALEX VUN", img: "/committee/alex-vun.jpg", linkedinUrl: "https://www.linkedin.com/in/alexvun/" },
      { role: "SUBCOMMITTEE", name: "MOE PYE SONE", img: "/committee/moe-pye-sone.jpg", linkedinUrl: "https://www.linkedin.com/in/moecrosoft/" },
      { role: "SUBCOMMITTEE", name: "CHUA WEE YEE GERALD", img: "/committee/gerald.jpg", linkedinUrl: "", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "TAN WEI QUAN", img: "/committee/wei-quan.jpg", linkedinUrl: "", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "STANLEY LAURENZ", img: "/committee/stanley-laurenz.jpg", linkedinUrl: "https://www.linkedin.com/in/stanleylaurenz/", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "VICKY YANG", img: "/committee/vicky-yang.jpg", linkedinUrl: "https://www.linkedin.com/in/vicky-yang-344845248/" },
      { role: "SUBCOMMITTEE", name: "NADON PANWONG", img: "/committee/nadon-panwong.jpg", linkedinUrl: "https://www.linkedin.com/in/nadon-panwong-9a4646364/", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "AMEER", img: "/committee/ameer.jpg", linkedinUrl: "https://www.linkedin.com/in/mohamed-ameerrr/" },
    ],
  },
  {
    label: "MARKETING TEAM",
    members: [
      { role: "SUBCOMMITTEE", name: "TEE YI JUN", img: "/committee/tee-yi-jun.jpg", linkedinUrl: "" },
      { role: "SUBCOMMITTEE", name: "NITYASHRI MEKA", img: "/committee/nityashri-meka.jpg", linkedinUrl: "https://www.linkedin.com/in/nityashrimeka04/" },
      { role: "SUBCOMMITTEE", name: "PAING THIT XAN", img: "/committee/paing-thit-xan.jpg", linkedinUrl: "https://www.linkedin.com/in/paingthitxan/" },
      { role: "SUBCOMMITTEE", name: "SWAMINATHAN SHRAVANTHIGA", img: "/committee/shravanthiga.jpg", linkedinUrl: "https://www.linkedin.com/in/shravanthiga-swaminathan/" },
      { role: "SUBCOMMITTEE", name: "AGRACIA YONG YI XIN", img: "/committee/agracia.jpg", linkedinUrl: "https://www.linkedin.com/in/agracia-yong-2355751a7/", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "MANIKANDAN SANJUVIGASINI", img: "/committee/sanju.jpg", linkedinUrl: "" },
      { role: "SUBCOMMITTEE", name: "ALBERT LIBRANTONO", img: "/committee/albert.jpg", linkedinUrl: "https://www.linkedin.com/in/albert-librantono/", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "KIMBERLY", img: "/committee/kimberly.jpg", linkedinUrl: "https://www.linkedin.com/in/kimberly-goh-k/", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "HELEN PRIYATNA", img: "/committee/helen.jpg", linkedinUrl: "https://www.linkedin.com/in/helen-priyatna-260393376/" },
    ],
  },
  {
    label: "PARTNERSHIP & INNOVATION",
    members: [
      { role: "SUBCOMMITTEE", name: "PHOO PWINT WAI", img: "/committee/phoo-pwint-wai.jpg", linkedinUrl: "https://www.linkedin.com/in/phoo-pwint-wai-80794b347/", frame: "tight", objectPosition: "50% 58%" },
      { role: "SUBCOMMITTEE", name: "SHISA YOSHIHIRO", img: "/committee/shisa-yoshihiro.jpg", linkedinUrl: "https://www.linkedin.com/in/shisayoshihiro/", scale: 1.85 },
      { role: "SUBCOMMITTEE", name: "EILEEN LEE", img: "/committee/eileen-lee.jpg", linkedinUrl: "", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "SU YI MAUNG", img: "/committee/su-yi-maung.jpg", linkedinUrl: "", scale: 1.85 },
      { role: "SUBCOMMITTEE", name: "KARTHIKEYAN SURESH", img: "/committee/karthik.jpg", linkedinUrl: "", frame: "tight" },
      { role: "SUBCOMMITTEE", name: "ANG LIJA", img: "/committee/lija.jpg", linkedinUrl: "https://www.linkedin.com/in/lijaang/", frame: "tight" },
    ],
  },
];

export default function Committee() {
  return (
    <section
      id="organise-members"
      className={`${ibmPlexMono.className} w-full bg-[#121212] text-white px-6 sm:px-10 md:px-14 py-16 sm:py-24 scroll-mt-11 border-t border-[#b30000]/40`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-6 mb-12 sm:mb-16">
          <h2
            className={`${montserrat.className} text-[26px] sm:text-[34px] md:text-[40px] font-extrabold tracking-tight text-white uppercase whitespace-nowrap`}
          >
            ORGANIZING <span className="text-[#d10000]">COMMITTEE</span>
          </h2>
          <div className="flex-1 h-px bg-[#d10000]/30" />
        </div>

        <div className="space-y-14 sm:space-y-20">
          {TEAMS.map((team) => (
            <div key={team.label}>
              <RevealItem>
                <div className="mb-6 sm:mb-8 flex items-center gap-4">
                  <span
                    className={`${montserrat.className} px-4 py-2 text-xs sm:text-sm font-extrabold tracking-[0.12em] uppercase bg-[#171717] text-white border border-[#d10000]/80 inline-block shadow-[3px_3px_0_0_#d10000]`}
                  >
                    // {team.label}
                  </span>
                  <div className="flex-1 h-[1px] bg-white/10" />
                </div>
              </RevealItem>

              <RevealStagger
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-5 sm:gap-6"
                stagger={0.04}
              >
                {team.members.map((member, i) => (
                  <RevealItem key={`${team.label}-${i}`}>
                    <Member3DCard member={member} />
                  </RevealItem>
                ))}
              </RevealStagger>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}