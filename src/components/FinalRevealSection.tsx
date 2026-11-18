import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp } from 'lucide-react';
import { MASTER_PLATE_URL } from '../data/sequenceConfig';

gsap.registerPlugin(ScrollTrigger);

export function FinalRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const vehicleWrapRef = useRef<HTMLDivElement>(null);
  const redGlowRef = useRef<HTMLDivElement>(null);

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
    const copy = copyRef.current;
    const vehicleWrap = vehicleWrapRef.current;
    const redGlow = redGlowRef.current;

    if (!section || !copy || !vehicleWrap || !redGlow) {
      return;
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(vehicleWrap, { opacity: 1, y: 0 });
        gsap.set(redGlow, { opacity: 1 });
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      const setupReveal = (startOpacity: number) => {
        gsap.set(vehicleWrap, { opacity: startOpacity, y: 12 });
        gsap.set(redGlow, { opacity: 0.15 });
        gsap.set(copy, { y: 14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          redGlow,
          {
            opacity: 1,
            ease: 'none',
            duration: 0.55,
          },
          0
        )
          .to(
            vehicleWrap,
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              duration: 0.78,
            },
            0.08
          )
          .to(
            copy,
            {
              y: 0,
              ease: 'none',
              duration: 0.5,
            },
            0.08
          );
      };

      mm.add('(min-width: 768px)', () => {
        setupReveal(0.2);
      });

      mm.add('(max-width: 767px)', () => {
        setupReveal(0.24);
      });

      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);


  const handleReturnToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      id="reveal"
      ref={sectionRef}
      aria-labelledby="reveal-heading"
      className="relative w-full overflow-hidden bg-[#050507] text-[#F4F5F7] md:min-h-[85vh] flex flex-col justify-between pt-14 pb-8 md:pt-24 md:pb-12"
    >
      {/* Top architectural separator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Main Finale Composition */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-12 my-auto flex flex-col-reverse md:flex-row md:items-center gap-6 md:gap-8">
        {/* Left Editorial Column (Desktop ~30-32%) / Lower Content (Mobile) */}
        <div
          ref={copyRef}
          className="relative z-20 w-full md:w-[32%] lg:w-[30%] shrink-0 will-change-transform"
        >
          <p className="text-xs font-medium tracking-[0.16em] text-[#9CA3AF]">
            04 · FINAL REVEAL
          </p>

          <h2
            id="reveal-heading"
            className="mt-2.5 font-display font-bold tracking-[0.02em] text-[#F4F5F7] leading-[0.95] text-balance"
            style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.5rem)' }}
          >
            Presence in Every Line
          </h2>

          {/* Single Discreet Editorial Action */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleReturnToTop}
              className={`group inline-flex items-center gap-2.5 min-h-[44px] py-2 pr-3 text-xs font-medium tracking-[0.1em] uppercase text-[#D1D5DB] hover:text-[#F4F5F7] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91E2A] ${
                prefersReducedMotion ? 'transition-none' : 'transition-colors duration-150'
              }`}
            >
              <ArrowUp
                className={`w-3.5 h-3.5 text-[#D91E2A] ${
                  prefersReducedMotion
                    ? 'transition-none'
                    : 'transition-transform duration-150 group-hover:-translate-y-0.5'
                }`}
                aria-hidden="true"
              />
              <span>Return to Opening Frame</span>
            </button>
          </div>
        </div>

        {/* Right Rear-Quarter Visual Stage (Desktop) / Full-Bleed Upper 4:3 Stage (Mobile) */}
        <div className="relative -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-[68%] lg:w-[70%] md:-mr-10 lg:-mr-16">
          <div className="relative w-full aspect-[4/3] md:aspect-[16/11] overflow-hidden bg-[#050507]">
            <div
              ref={vehicleWrapRef}
              className="absolute inset-0 will-change-[transform,opacity]"
            >
              {!imgFailed ? (
                <img
                  src={MASTER_PLATE_URL}
                  alt="Low-key studio close crop of the APEX R-01 fastback roof line, rear quarter fender, rear forged wheel, and narrow glowing red rear light signature"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover object-[76%_48%] md:object-[78%_48%] origin-[76%_48%] md:origin-[78%_48%] scale-[1.18] md:scale-[1.24] brightness-[0.88] contrast-[1.08] select-none block"
                />
              ) : (
                <div
                  role="img"
                  aria-label="APEX R-01 dark obsidian and crimson finale fallback"
                  className="w-full h-full bg-[radial-gradient(ellipse_at_72%_46%,rgba(217,30,42,0.22),rgba(42,46,56,0.32)_35%,#050507_78%)]"
                />
              )}
            </div>

            {/* Restrained red atmospheric glow emphasizing the existing rear light signature */}
            <div
              ref={redGlowRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_44%,rgba(217,30,42,0.2),rgba(217,30,42,0.06)_24%,transparent_52%)] will-change-[opacity]"
            />

            {/* Soft gradients & radial vignette dissolving front portion and edges into #050507 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/70 via-30% to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#050507]/75 via-transparent to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/85"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_64%_48%,transparent_34%,rgba(5,5,7,0.86)_78%,#050507_100%)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
