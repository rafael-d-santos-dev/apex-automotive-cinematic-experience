import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MASTER_PLATE_URL } from '../data/sequenceConfig';

gsap.registerPlugin(ScrollTrigger);

const ROOF_ARC_PATH =
  'M 445 344 C 520 292, 625 232, 790 227 C 960 225, 1085 268, 1235 336';
const SHOULDER_LINE_PATH =
  'M 152 406 C 275 390, 465 352, 620 335 C 760 324, 900 342, 1014 367';
const REAR_LIGHT_PATH =
  'M 1014 367 C 1095 344, 1185 329, 1268 344 L 1244 376';

export function DesignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageGroupRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const roofPathRef = useRef<SVGPathElement>(null);
  const shoulderPathRef = useRef<SVGPathElement>(null);
  const rearLightPathRef = useRef<SVGPathElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const section = sectionRef.current;
    const stageGroup = stageGroupRef.current;
    const imageWrap = imageWrapRef.current;
    const roofPath = roofPathRef.current;
    const shoulderPath = shoulderPathRef.current;
    const rearLightPath = rearLightPathRef.current;
    const copy = copyRef.current;

    if (
      !section ||
      !stageGroup ||
      !imageWrap ||
      !roofPath ||
      !shoulderPath ||
      !rearLightPath ||
      !copy
    ) {
      return;
    }

    const roofLen = roofPath.getTotalLength();
    const shoulderLen = shoulderPath.getTotalLength();
    const rearLen = rearLightPath.getTotalLength();

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([roofPath, shoulderPath, rearLightPath], {
          strokeDasharray: 'none',
          strokeDashoffset: 0,
          opacity: 1,
        });
        gsap.set(imageWrap, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(stageGroup, { x: 0, scale: 1 });
        gsap.set(copy, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(roofPath, {
        strokeDasharray: roofLen,
        strokeDashoffset: roofLen,
      });
      gsap.set(shoulderPath, {
        strokeDasharray: shoulderLen,
        strokeDashoffset: shoulderLen,
      });
      gsap.set(rearLightPath, {
        strokeDasharray: rearLen,
        strokeDashoffset: rearLen,
        opacity: 0.45,
      });
      gsap.set(imageWrap, {
        clipPath: 'inset(0% 100% 0% 0%)',
      });
      gsap.set(stageGroup, {
        x: 24,
        scale: 1.03,
      });
      gsap.set(copy, {
        y: 12,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          end: 'bottom bottom',
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        roofPath,
        {
          strokeDashoffset: 0,
          ease: 'none',
          duration: 0.45,
        },
        0
      )
        .to(
          shoulderPath,
          {
            strokeDashoffset: 0,
            ease: 'none',
            duration: 0.48,
          },
          0.06
        )
        .to(
          imageWrap,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            duration: 0.55,
          },
          0.22
        )
        .to(
          stageGroup,
          {
            x: 0,
            scale: 1,
            ease: 'none',
            duration: 0.78,
          },
          0.12
        )
        .to(
          rearLightPath,
          {
            strokeDashoffset: 0,
            opacity: 1,
            ease: 'none',
            duration: 0.36,
          },
          0.54
        )
        .to(
          copy,
          {
            y: 0,
            ease: 'none',
            duration: 0.45,
          },
          0.1
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="design"
      ref={sectionRef}
      aria-labelledby="design-heading"
      className="relative w-full overflow-hidden bg-[#050507] text-[#F4F5F7] py-14 md:py-24 lg:py-32"
    >
      {/* Subtle architectural surface transition from Hero #050507 */}
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
            01 · DESIGN
          </p>

          <h2
            id="design-heading"
            className="mt-2.5 font-display font-bold tracking-[0.02em] text-[#F4F5F7] leading-[0.95] text-balance"
            style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.5rem)' }}
          >
            Sculpted for Unbroken Air
          </h2>

          {/* Discreet unboxed contour micro-labels */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] tracking-[0.06em] text-[#9CA3AF]">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span
                aria-hidden="true"
                className="inline-block w-3.5 h-px bg-[#F4F5F7]/75"
              />
              Roof Arc
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span
                aria-hidden="true"
                className="inline-block w-3.5 h-px bg-[#9CA3AF]/80"
              />
              Shoulder Line
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-[#F4F5F7]">
              <span
                aria-hidden="true"
                className="inline-block w-3.5 h-[1.5px] bg-[#D91E2A]"
              />
              Rear Signature
            </span>
          </div>
        </div>

        {/* Right Vehicle & SVG Contour Stage (Desktop) / Upper Visual (Mobile) */}
        <div className="relative -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-[72%] lg:w-[74%] md:-mr-12 lg:-mr-20">
          <div
            ref={stageGroupRef}
            className="relative w-full aspect-[1376/768] will-change-transform"
          >
            {/* Vehicle Plate Reveal Layer */}
            <div
              ref={imageWrapRef}
              className="absolute inset-0 will-change-[clip-path]"
            >
              {!imgFailed ? (
                <img
                  src={MASTER_PLATE_URL}
                  alt="APEX R-01 three-quarter studio view showing the recessed cabin, low hood, continuous shoulder line, and narrow red rear light blade"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-fill select-none block"
                />
              ) : (
                <div
                  role="img"
                  aria-label="APEX R-01 dark graphite studio silhouette fallback"
                  className="w-full h-full bg-[radial-gradient(ellipse_at_55%_48%,rgba(56,62,74,0.35),#0B0C0F_68%,#050507)]"
                />
              )}

              {/* Studio edge blending into #050507 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-[#050507]/35"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/75"
              />
            </div>

            {/* Locked 1376x768 Inline SVG Contour Overlay */}
            <svg
              viewBox="0 0 1376 768"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full"
            >
              <path
                ref={roofPathRef}
                d={ROOF_ARC_PATH}
                stroke="#F4F5F7"
                strokeOpacity="0.82"
                strokeWidth="2.2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                ref={shoulderPathRef}
                d={SHOULDER_LINE_PATH}
                stroke="#9CA3AF"
                strokeOpacity="0.72"
                strokeWidth="1.8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                ref={rearLightPathRef}
                d={REAR_LIGHT_PATH}
                stroke="#D91E2A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
