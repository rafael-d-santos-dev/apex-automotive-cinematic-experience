import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MASTER_PLATE_URL } from '../data/sequenceConfig';

gsap.registerPlugin(ScrollTrigger);

type PerformanceMode = 'grand-touring' | 'track-focus';

const MODE_NOTES: Record<PerformanceMode, string> = {
  'grand-touring': 'Grand Touring — composed wide framing, balanced light',
  'track-focus': 'Track Focus — closer stance, restrained crimson accent',
};

export function PerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stageClipRef = useRef<HTMLDivElement>(null);
  const panLayerRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<PerformanceMode>('grand-touring');
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
    const heading = headingRef.current;
    const stageClip = stageClipRef.current;
    const panLayer = panLayerRef.current;
    const lightSweep = lightSweepRef.current;

    if (!section || !heading || !stageClip || !panLayer || !lightSweep) {
      return;
    }

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(stageClip, { clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(panLayer, { x: 0 });
        gsap.set(heading, { y: 0, opacity: 1 });
        gsap.set(lightSweep, { opacity: 0, xPercent: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      const setupTimeline = (panStart: number, panEnd: number) => {
        gsap.set(stageClip, { clipPath: 'inset(12% 0% 12% 0%)' });
        gsap.set(panLayer, { x: panStart });
        gsap.set(heading, { y: 12 });
        gsap.set(lightSweep, { xPercent: -35, opacity: 0 });

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
          stageClip,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            duration: 0.5,
          },
          0
        )
          .to(
            panLayer,
            {
              x: panEnd,
              ease: 'none',
              duration: 0.9,
            },
            0.05
          )
          .to(
            heading,
            {
              y: 0,
              ease: 'none',
              duration: 0.45,
            },
            0.05
          )
          .to(
            lightSweep,
            {
              xPercent: 40,
              opacity: 0.85,
              ease: 'none',
              duration: 0.5,
            },
            0.15
          )
          .to(
            lightSweep,
            {
              opacity: 0.2,
              ease: 'none',
              duration: 0.4,
            },
            0.65
          );
      };

      mm.add('(min-width: 768px)', () => {
        setupTimeline(14, -14);
      });

      mm.add('(max-width: 767px)', () => {
        setupTimeline(8, -8);
      });

      return () => {
        mm.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const isTrackFocus = mode === 'track-focus';
  const modeNote = MODE_NOTES[mode];
  const transitionClass = prefersReducedMotion
    ? 'transition-none'
    : 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

  return (
    <section
      id="performance"
      ref={sectionRef}
      aria-labelledby="performance-heading"
      className="relative w-full overflow-hidden bg-[#050507] text-[#F4F5F7] py-14 md:py-24 lg:py-32"
    >
      {/* Subtle top hairline separator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 md:px-12 flex flex-col md:grid md:grid-cols-[1fr_auto] md:items-end gap-x-8">
        {/* Editorial Header */}
        <div
          ref={headingRef}
          className="order-1 max-w-2xl will-change-transform"
        >
          <p className="text-xs font-medium tracking-[0.16em] text-[#9CA3AF]">
            03 · PERFORMANCE
          </p>

          <h2
            id="performance-heading"
            className="mt-2.5 font-display font-bold tracking-[0.02em] text-[#F4F5F7] leading-[0.95] text-balance"
            style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.5rem)' }}
          >
            Intent Shaped in Motion
          </h2>
        </div>

        {/* Minimal Two-State Calibration Selector (Desktop header right / Mobile below image) */}
        <div className="order-3 mt-5 md:order-2 md:mt-0 md:justify-self-end md:self-end shrink-0">
          <div
            role="group"
            aria-label="Visual performance character mode"
            className="inline-flex items-center gap-6"
          >
            <button
              type="button"
              aria-pressed={mode === 'grand-touring'}
              onClick={() => setMode('grand-touring')}
              className={`relative min-h-[44px] py-2 text-xs font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91E2A] ${
                prefersReducedMotion ? 'transition-none' : 'transition-colors duration-150'
              } ${
                mode === 'grand-touring'
                  ? 'text-[#F4F5F7]'
                  : 'text-[#9CA3AF] hover:text-[#F4F5F7]'
              }`}
            >
              <span>Grand Touring</span>
              <span
                aria-hidden="true"
                className={`absolute left-0 right-0 bottom-1 h-[1.5px] bg-[#D91E2A] origin-left ${
                  prefersReducedMotion ? 'transition-none' : 'transition-transform duration-200'
                } ${mode === 'grand-touring' ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>

            <button
              type="button"
              aria-pressed={mode === 'track-focus'}
              onClick={() => setMode('track-focus')}
              className={`relative min-h-[44px] py-2 text-xs font-medium tracking-[0.1em] uppercase whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91E2A] ${
                prefersReducedMotion ? 'transition-none' : 'transition-colors duration-150'
              } ${
                mode === 'track-focus'
                  ? 'text-[#F4F5F7]'
                  : 'text-[#9CA3AF] hover:text-[#F4F5F7]'
              }`}
            >
              <span>Track Focus</span>
              <span
                aria-hidden="true"
                className={`absolute left-0 right-0 bottom-1 h-[1.5px] bg-[#D91E2A] origin-left ${
                  prefersReducedMotion ? 'transition-none' : 'transition-transform duration-200'
                } ${mode === 'track-focus' ? 'scale-x-100' : 'scale-x-0'}`}
              />
            </button>
          </div>
        </div>

        {/* Panoramic Visual Stage: 16:10 Mobile / ~21:9 Desktop */}
        <div className="order-2 mt-6 md:order-3 md:col-span-2 md:mt-8 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full">
          <div
            ref={stageClipRef}
            className="relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-[#0B0C0F] will-change-[clip-path]"
          >
            {/* Scroll-linked horizontal pan wrapper (isolated from mode scale) */}
            <div
              ref={panLayerRef}
              className="absolute inset-0 will-change-transform"
            >
              {/* Mode-linked visual scale & framing wrapper */}
              <div
                style={{ transformOrigin: '56% 52%' }}
                className={`w-full h-full will-change-transform ${transitionClass} ${
                  isTrackFocus
                    ? 'scale-[1.102] md:scale-[1.123]'
                    : 'scale-[1.06] md:scale-[1.08]'
                }`}
              >
                {!imgFailed ? (
                  <img
                    src={MASTER_PLATE_URL}
                    alt="Panoramic studio profile of the APEX R-01 metallic graphite sports coupe showing its full low-slung silhouette, forged wheels, and narrow red rear light blade"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgFailed(true)}
                    style={{ objectPosition: '50% 54%' }}
                    className="w-full h-full object-cover select-none block"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label="APEX R-01 panoramic obsidian studio fallback"
                    className="w-full h-full bg-[radial-gradient(ellipse_at_50%_50%,rgba(64,70,84,0.34),#0B0C0F_68%,#050507)]"
                  />
                )}
              </div>
            </div>

            {/* Subtle soft studio-light sweep linked to scroll */}
            <div
              ref={lightSweepRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[65%] bg-[radial-gradient(ellipse_at_50%_75%,rgba(226,232,240,0.09),rgba(226,232,240,0.02)_45%,transparent_75%)] will-change-transform"
            />

            {/* Atmospheric darkening & edge blend (deepens slightly in Track Focus) */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/85 ${transitionClass} ${
                isTrackFocus ? 'opacity-100' : 'opacity-80'
              }`}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050507]/85 via-transparent to-[#050507]/85 ${transitionClass} ${
                isTrackFocus ? 'opacity-100' : 'opacity-75'
              }`}
            />

            {/* Track Focus restrained crimson accent near existing rear red light signature */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_46%,rgba(217,30,42,0.18),rgba(217,30,42,0.05)_24%,transparent_48%)] ${transitionClass} ${
                isTrackFocus ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>

        {/* Quiet Minimal Lower Note & Conceptual Disclosure */}
        <div className="order-4 mt-4 md:mt-5 md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] tracking-[0.03em] text-[#9CA3AF]">
          <p className="font-mono text-[11px] tracking-[0.06em] text-[#D1D5DB]/85">
            {modeNote}
          </p>
          <p>
            Conceptual study — no verified test data or production claims.
          </p>
        </div>
      </div>
    </section>
  );
}
