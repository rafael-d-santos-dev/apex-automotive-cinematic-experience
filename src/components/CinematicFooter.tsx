import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SPOKE_ANGLES = Array.from({ length: 10 }, (_, idx) => idx * 36);

export function CinematicFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const whiteWordmarkRef = useRef<HTMLSpanElement>(null);
  const wheelTrackRef = useRef<HTMLDivElement>(null);
  const wheelSpinRef = useRef<SVGSVGElement>(null);
  const revealContentRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    const stage = stageRef.current;
    const whiteWordmark = whiteWordmarkRef.current;
    const wheelTrack = wheelTrackRef.current;
    const wheelSpin = wheelSpinRef.current;
    const revealContent = revealContentRef.current;

    if (
      !footer ||
      !stage ||
      !whiteWordmark ||
      !wheelTrack ||
      !wheelSpin ||
      !revealContent
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(whiteWordmark, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(wheelTrack, { opacity: 0 });
        gsap.set(revealContent, { opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      const setupFooterSequence = () => {
        const getMetrics = () => {
          const stageWidth = stage.clientWidth;
          const wheelDiameter = wheelTrack.offsetWidth || 140;
          const startX = -(wheelDiameter + 24);
          const endX = stageWidth + 24;
          const distance = endX - startX;
          const rotation = (distance / (Math.PI * wheelDiameter)) * 360;
          return { stageWidth, wheelDiameter, startX, endX, rotation };
        };

        gsap.set(whiteWordmark, { clipPath: 'inset(0% 100% 0% 0%)' });
        gsap.set(wheelTrack, { x: () => getMetrics().startX, opacity: 1 });
        gsap.set(wheelSpin, { rotation: 0, transformOrigin: '50% 50%' });
        gsap.set(revealContent, { opacity: 0, y: 14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            once: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          wheelTrack,
          {
            x: () => getMetrics().endX,
            duration: 1.75,
            ease: 'power2.inOut',
            onUpdate: () => {
              const { stageWidth, wheelDiameter } = getMetrics();
              const currentX = Number(gsap.getProperty(wheelTrack, 'x')) || 0;
              const wheelCenter = currentX + wheelDiameter * 0.5;
              const revealPct = Math.max(
                0,
                Math.min(100, (wheelCenter / Math.max(1, stageWidth)) * 100)
              );
              whiteWordmark.style.clipPath = `inset(0% ${(100 - revealPct).toFixed(2)}% 0% 0%)`;
            },
            onComplete: () => {
              whiteWordmark.style.clipPath = 'inset(0% 0% 0% 0%)';
            },
          },
          0
        )
          .to(
            wheelSpin,
            {
              rotation: () => getMetrics().rotation,
              duration: 1.75,
              ease: 'power2.inOut',
            },
            0
          )
          .to(
            revealContent,
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: 'power2.out',
            },
            1.5
          );
      };

      mm.add('(min-width: 768px)', () => {
        setupFooterSequence();
      });

      mm.add('(max-width: 767px)', () => {
        setupFooterSequence();
      });

      return () => {
        mm.revert();
      };
    }, footerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <footer
      ref={footerRef}
      aria-label="APEX R-01 campaign signature"
      className="relative w-full overflow-hidden bg-[#050507] text-[#F4F5F7] pt-16 pb-10 md:pt-24 md:pb-12"
    >
      {/* Top architectural separator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Full-width Wordmark & Wheel Crossing Stage */}
      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-[1440px] px-5 md:px-12 overflow-hidden py-6 md:py-10"
      >
        <div className="relative flex items-center justify-center">
          {/* Dark Graphite Base Wordmark (decorative silhouette under wipe) */}
          <span
            aria-hidden="true"
            className="block font-display font-bold uppercase tracking-[0.12em] leading-[0.84] text-[#181B22] whitespace-nowrap select-none text-center"
            style={{ fontSize: 'clamp(4.75rem, 34vw, 31.5rem)' }}
          >
            APEX
          </span>

          {/* Illuminated White Wordmark (visible by default for fallback; GSAP wipes in lockstep with wheel) */}
          <span
            ref={whiteWordmarkRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-display font-bold uppercase tracking-[0.12em] leading-[0.84] text-[#F4F5F7] whitespace-nowrap select-none text-center will-change-[clip-path]"
            style={{ fontSize: 'clamp(4.75rem, 34vw, 31.5rem)' }}
          >
            APEX
          </span>
        </div>

        {/* Stylized Forged Wheel Assembly Crossing Left-to-Right */}
        <div
          ref={wheelTrackRef}
          aria-hidden="true"
          className="pointer-events-none opacity-0 absolute inset-y-0 left-0 flex items-center w-[84px] sm:w-[92px] md:w-[144px] lg:w-[168px] will-change-transform"
        >
          <div className="relative w-full aspect-square">
            {/* Subtle Floor Contact Shadow & Restrained Crimson Accent */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[82%] h-2.5 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.92),transparent_72%)]" />
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-[54%] h-[1.5px] bg-gradient-to-r from-transparent via-[#D91E2A]/60 to-transparent" />

            {/* Layer A: Non-Rotating Inner Rotor & Stationary Red Brake Caliper */}
            <svg
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full block"
            >
              {/* Ventilated Rotor Disc */}
              <circle
                cx="100"
                cy="100"
                r="62"
                fill="#0C0E12"
                stroke="#1E222B"
                strokeWidth="1.5"
              />
              <circle
                cx="100"
                cy="100"
                r="50"
                stroke="#262B36"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
              <circle
                cx="100"
                cy="100"
                r="38"
                stroke="#1B1F27"
                strokeWidth="1"
              />

              {/* Stationary Recessed Racing-Red Brake Caliper (9 o'clock) */}
              <path
                d="M 42 74 C 37 88, 37 112, 42 126 L 56 121 C 52 108, 52 92, 56 79 Z"
                fill="#D91E2A"
              />
              <path
                d="M 45 79 C 41 91, 41 109, 45 121"
                stroke="#F4F5F7"
                strokeOpacity="0.28"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>

            {/* Layer B: Rotating Tire, Graphite Metallic Rim & Ten-Spoke Forged Wheel */}
            <svg
              ref={wheelSpinRef}
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full block will-change-transform"
            >
              {/* Low-Profile Tire Sidewall */}
              <circle cx="100" cy="100" r="95" fill="#07080B" />
              <circle
                cx="100"
                cy="100"
                r="94"
                stroke="#1A1E26"
                strokeWidth="1.5"
              />
              <circle
                cx="100"
                cy="100"
                r="83"
                stroke="#14171E"
                strokeWidth="1"
              />

              {/* Graphite Metallic Outer Rim Lip */}
              <circle
                cx="100"
                cy="100"
                r="76"
                stroke="#3A404D"
                strokeWidth="3.5"
              />
              <circle
                cx="100"
                cy="100"
                r="73.5"
                stroke="#9CA3AF"
                strokeOpacity="0.32"
                strokeWidth="0.9"
              />

              {/* Ten Forged Dark Metallic Spokes */}
              {SPOKE_ANGLES.map((angle) => (
                <g key={angle} transform={`rotate(${angle} 100 100)`}>
                  <path
                    d="M 96.4 26.5 L 103.6 26.5 L 102.2 79.5 L 97.8 79.5 Z"
                    fill="#1D2129"
                  />
                  <line
                    x1="97.3"
                    y1="27.5"
                    x2="98.3"
                    y2="79"
                    stroke="#9CA3AF"
                    strokeOpacity="0.4"
                    strokeWidth="0.85"
                  />
                  <line
                    x1="102.7"
                    y1="27.5"
                    x2="101.7"
                    y2="79"
                    stroke="#050507"
                    strokeOpacity="0.85"
                    strokeWidth="0.85"
                  />
                </g>
              ))}

              {/* Central Hub & Restrained Crimson Center Ring */}
              <circle
                cx="100"
                cy="100"
                r="22"
                fill="#14161B"
                stroke="#2F3440"
                strokeWidth="1.5"
              />
              <circle
                cx="100"
                cy="100"
                r="11"
                fill="#0B0C0F"
                stroke="#D91E2A"
                strokeOpacity="0.85"
                strokeWidth="1.4"
              />
              <circle cx="100" cy="100" r="3.5" fill="#9CA3AF" fillOpacity="0.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* Post-Wheel Editorial Description & Project Identification */}
      <div
        ref={revealContentRef}
        className="relative mx-auto w-full max-w-[1440px] px-5 md:px-12 mt-4 md:mt-6 will-change-[transform,opacity]"
      >
        <p className="mx-auto max-w-xl text-center text-sm md:text-base text-[#D1D5DB] leading-relaxed">
          APEX R-01 is a fictional automotive concept created as a portfolio
          project, exploring cinematic web design, visual storytelling and
          interactive motion.
        </p>

        <div className="mt-10 md:mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center md:justify-between gap-2 text-center md:text-left font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-[#9CA3AF]">
          <span>APEX R-01</span>
          <span>FICTIONAL AUTOMOTIVE CONCEPT</span>
          <span>DESIGN &amp; DEVELOPMENT — PORTFOLIO PROJECT</span>
        </div>
      </div>
    </footer>
  );
}
