import { useCallback, useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MASTER_PLATE_URL } from '../data/sequenceConfig';

gsap.registerPlugin(ScrollTrigger);

interface MaterialItem {
  index: string;
  label: string;
}

const MATERIAL_ITEMS: MaterialItem[] = [
  { index: '01', label: 'Carbon-Cell Matrix' },
  { index: '02', label: 'Forged Ten-Spoke' },
  { index: '03', label: 'Fender Extraction' },
];

export function EngineeringSection() {
  const patternId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const exteriorLayerRef = useRef<HTMLDivElement>(null);
  const exteriorImageRef = useRef<HTMLImageElement>(null);
  const desktopDividerRef = useRef<SVGLineElement>(null);
  const mobileDividerRef = useRef<HTMLDivElement>(null);

  const [imgFailed, setImgFailed] = useState(false);
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

  const applySplitProgress = useCallback((split: number, isDesktop: boolean) => {
    const exteriorLayer = exteriorLayerRef.current;
    const exteriorImg = exteriorImageRef.current;
    const desktopDivider = desktopDividerRef.current;
    const mobileDivider = mobileDividerRef.current;

    if (!exteriorLayer) return;

    const clamped = Math.max(0, Math.min(1, split));
    const lineOpacity = Math.min(1, clamped * 2.2).toFixed(3);

    if (isDesktop) {
      const topX = 100 - clamped * 36; // 100% -> 64%
      const botX = 100 - clamped * 54; // 100% -> 46%
      exteriorLayer.style.clipPath = `polygon(0% 0%, ${topX.toFixed(2)}% 0%, ${botX.toFixed(2)}% 100%, 0% 100%)`;

      if (exteriorImg) {
        const shiftX = (1 - clamped) * 14;
        exteriorImg.style.transform = `translate3d(${shiftX.toFixed(2)}px, 0, 0) scale(1.48)`;
      }
      if (desktopDivider) {
        desktopDivider.setAttribute('x1', `${topX.toFixed(2)}%`);
        desktopDivider.setAttribute('x2', `${botX.toFixed(2)}%`);
        desktopDivider.style.opacity = lineOpacity;
      }
      if (mobileDivider) {
        mobileDivider.style.opacity = '0';
      }
    } else {
      const bottomCut = clamped * 38; // 0% -> 38% upward reveal
      exteriorLayer.style.clipPath = `inset(0% 0% ${bottomCut.toFixed(2)}% 0%)`;

      if (exteriorImg) {
        const shiftY = (1 - clamped) * 8;
        exteriorImg.style.transform = `translate3d(0, ${shiftY.toFixed(2)}px, 0) scale(1.36)`;
      }
      if (mobileDivider) {
        mobileDivider.style.top = `${(100 - bottomCut).toFixed(2)}%`;
        mobileDivider.style.opacity = lineOpacity;
      }
      if (desktopDivider) {
        desktopDivider.style.opacity = '0';
      }
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        applySplitProgress(1, window.innerWidth >= 768);
        gsap.set(copy, { y: 0, opacity: 1 });

        const onResize = () => {
          applySplitProgress(1, window.innerWidth >= 768);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }

      const mm = gsap.matchMedia();

      const setupReveal = (isDesktop: boolean) => {
        const proxy = { split: 0 };
        applySplitProgress(0, isDesktop);
        gsap.set(copy, { y: 12 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          proxy,
          {
            split: 1,
            ease: 'none',
            duration: 0.85,
            onUpdate: () => {
              applySplitProgress(proxy.split, isDesktop);
            },
          },
          0.08
        ).to(
          copy,
          {
            y: 0,
            ease: 'none',
            duration: 0.45,
          },
          0.05
        );
      };

      mm.add('(min-width: 768px)', () => {
        setupReveal(true);
      });

      mm.add('(max-width: 767px)', () => {
        setupReveal(false);
      });

      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, applySplitProgress]);

  return (
    <section
      id="engineering"
      ref={sectionRef}
      aria-labelledby="engineering-heading"
      className="relative w-full overflow-hidden bg-[#050507] text-[#F4F5F7] py-14 md:py-24 lg:py-32"
    >
      {/* Top architectural separator matching DesignSection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-12 flex flex-col-reverse md:flex-row md:items-center gap-6 md:gap-8">
        {/* Left Editorial Column (Desktop) / Lower Column (Mobile) */}
        <div
          ref={copyRef}
          className="relative z-20 w-full md:w-[30%] lg:w-[28%] shrink-0 will-change-transform"
        >
          <p className="text-xs font-medium tracking-[0.16em] text-[#9CA3AF]">
            02 · ENGINEERING
          </p>

          <h2
            id="engineering-heading"
            className="mt-2.5 font-display font-bold tracking-[0.02em] text-[#F4F5F7] leading-[0.95] text-balance"
            style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.5rem)' }}
          >
            Carbon Mass. Forged Poise.
          </h2>

          {/* Minimal semantic material index */}
          <ul className="mt-6 space-y-2.5">
            {MATERIAL_ITEMS.map((item) => (
              <li key={item.index} className="flex items-baseline gap-3">
                <span className="font-mono text-xs tabular-nums tracking-[0.1em] text-[#D91E2A] shrink-0">
                  {item.index}
                </span>
                <span className="text-sm font-medium text-[#F4F5F7] tracking-[0.01em]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[11px] tracking-[0.02em] text-[#9CA3AF]">
            Conceptual study — non-production specifications.
          </p>
        </div>

        {/* Right Visual Stage (Desktop) / Upper Stage (Mobile) */}
        <div className="relative -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-[70%] lg:w-[72%] min-w-0">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/11] overflow-hidden bg-[#0B0C0F]">
            {/* Underlying Abstract Conceptual Carbon-Inspired Layer */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#0B0C0F]"
            >
              <svg
                className="w-full h-full block"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id={patternId}
                    width="12"
                    height="12"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="12" height="12" fill="#0B0C0F" />
                    <path d="M0 0h6v6H0zM6 6h6v6H6z" fill="#14161B" />
                    <path
                      d="M0 6l6-6M6 12l6-6"
                      stroke="#1E222B"
                      strokeWidth="0.75"
                      strokeOpacity="0.65"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
              </svg>

              {/* Subtle grazing studio light across the conceptual material layer */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_30%,rgba(244,245,247,0.08),rgba(217,30,42,0.025)_42%,rgba(5,5,7,0.88)_86%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/85 via-transparent to-[#050507]/55" />

              {/* Subtle conceptual material visualization label */}
              <div className="absolute bottom-4 right-5 md:bottom-6 md:right-7 text-right">
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#D1D5DB]/85">
                  CONCEPTUAL MATERIAL STUDY
                </p>
              </div>
            </div>

            {/* Exterior Medium-Close Crop Layer (Front Wheel, Red Caliper, Fender & Air Outlet) */}
            <div
              ref={exteriorLayerRef}
              className="absolute inset-0 overflow-hidden will-change-[clip-path]"
            >
              {!imgFailed ? (
                <img
                  ref={exteriorImageRef}
                  src={MASTER_PLATE_URL}
                  alt="Medium-close studio crop of the APEX R-01 front ten-spoke forged wheel, red brake caliper, sculpted fender, and front-quarter side air outlet"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                  style={{
                    objectPosition: '46% 60%',
                    transformOrigin: '46% 60%',
                  }}
                  className="w-full h-full object-cover select-none block will-change-transform"
                />
              ) : (
                <div
                  role="img"
                  aria-label="APEX R-01 graphite studio fallback"
                  className="w-full h-full bg-[radial-gradient(ellipse_at_46%_58%,rgba(72,78,92,0.35),#0B0C0F_72%,#050507)]"
                />
              )}

              {/* Subtle outer edge blending without darkening caliper/wheel contrast */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050507]/75 via-transparent to-[#050507]/25"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507]/75 via-transparent to-[#050507]/55"
              />
            </div>

            {/* Desktop Diagonal Divider Line */}
            <svg
              aria-hidden="true"
              className="pointer-events-none hidden md:block absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                ref={desktopDividerRef}
                x1="100%"
                y1="0%"
                x2="100%"
                y2="100%"
                stroke="#F4F5F7"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
            </svg>

            {/* Mobile Horizontal Curtain Divider Line */}
            <div
              ref={mobileDividerRef}
              aria-hidden="true"
              className="pointer-events-none md:hidden absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#F4F5F7]/55 to-transparent opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
