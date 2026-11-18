import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DESKTOP_FRAMES, MOBILE_FRAMES } from '../data/sequenceConfig';
import {
  ProgressiveSequenceLoader,
  ViewportProfile,
  renderCameraFrame,
  sampleCameraState,
} from '../lib/sequenceEngine';

gsap.registerPlugin(ScrollTrigger);

interface HeroCaption {
  id: string;
  start: number;
  end: number;
  title: string;
  subtitle: string;
  desktopAlign: 'left' | 'right';
  isPrimaryHeading?: boolean;
}

const HERO_CAPTIONS: HeroCaption[] = [
  {
    id: 'opening',
    start: 0.0,
    end: 0.14,
    title: 'APEX R-01',
    subtitle: 'STUDIO SEQUENCE',
    desktopAlign: 'left',
    isPrimaryHeading: true,
  },
  {
    id: 'splitter',
    start: 0.24,
    end: 0.36,
    title: 'Front Splitter',
    subtitle: 'SCULPTED AIRFLOW',
    desktopAlign: 'right',
  },
  {
    id: 'architecture',
    start: 0.5,
    end: 0.62,
    title: 'Forged Architecture',
    subtitle: 'FORM IN DETAIL',
    desktopAlign: 'left',
  },
  {
    id: 'rear-light',
    start: 0.74,
    end: 0.86,
    title: 'Rear Light Signature',
    subtitle: 'RESTRAINED CRIMSON',
    desktopAlign: 'left',
  },
];

function getActiveCaptionIndex(progress: number): number {
  for (let i = 0; i < HERO_CAPTIONS.length; i++) {
    const caption = HERO_CAPTIONS[i];
    if (progress >= caption.start && progress < caption.end) {
      return i;
    }
  }
  return -1;
}

export function CinematicHero() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loaderRef = useRef<ProgressiveSequenceLoader | null>(null);
  const progressRef = useRef<number>(0);
  const profileRef = useRef<ViewportProfile>('desktop');

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeCaptionIdx, setActiveCaptionIdx] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Render current progress onto the canvas
  const drawAtProgress = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      const loader = loaderRef.current;
      const source = loader?.getSource();
      if (!canvas || !source) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const profile = profileRef.current;
      const frames = profile === 'desktop' ? DESKTOP_FRAMES : MOBILE_FRAMES;
      const state = sampleCameraState(frames, progress);

      renderCameraFrame(
        ctx,
        source,
        canvas.width,
        canvas.height,
        state,
        profile
      );

      if (!prefersReducedMotion) {
        const nextCaption = getActiveCaptionIndex(progress);
        setActiveCaptionIdx((prev) => (prev !== nextCaption ? nextCaption : prev));
      }
    },
    [prefersReducedMotion]
  );

  // Size canvas sharply to viewport & devicePixelRatio
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const rect = stage.getBoundingClientRect();
    const isDesktop = window.innerWidth >= 768;
    profileRef.current = isDesktop ? 'desktop' : 'mobile';

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.max(1, Math.round(rect.width * dpr));
    const targetH = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    drawAtProgress(progressRef.current);
  }, [drawAtProgress]);

  // Listen to prefers-reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      setPrefersReducedMotion(mq.matches);
      if (mq.matches) {
        progressRef.current = 0;
        setActiveCaptionIdx(0);
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Progressive master plate decode & initial/progressive frame baking
  useEffect(() => {
    const initialProfile: ViewportProfile =
      window.innerWidth >= 768 ? 'desktop' : 'mobile';
    profileRef.current = initialProfile;

    const loader = new ProgressiveSequenceLoader();
    loaderRef.current = loader;

    loader.init(
      initialProfile,
      () => {
        setIsReady(true);
        syncCanvasSize();
      },
      undefined,
      () => {
        setHasError(true);
      }
    );

    return () => {
      loader.destroy();
      loaderRef.current = null;
    };
  }, [syncCanvasSize]);

  // Keep canvas sized cleanly on resize / mobile dynamic bar changes
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    syncCanvasSize();
    const observer = new ResizeObserver(() => {
      syncCanvasSize();
    });
    observer.observe(stage);

    return () => observer.disconnect();
  }, [syncCanvasSize]);

  // GSAP ScrollTrigger setup for Desktop and Mobile
  useEffect(() => {
    if (prefersReducedMotion || !trackRef.current || !stageRef.current) {
      return;
    }

    const mm = gsap.matchMedia();

    const createSequenceTrigger = (scrubSmoothness: number, profile: ViewportProfile) => {
      profileRef.current = profile;
      const proxy = { progress: progressRef.current };

      gsap.to(proxy, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: stageRef.current,
          pinSpacing: false,
          scrub: scrubSmoothness,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            drawAtProgress(self.progress);
          },
        },
      });
    };

    mm.add('(min-width: 768px)', () => {
      createSequenceTrigger(0.45, 'desktop');
    });

    mm.add('(max-width: 767px)', () => {
      createSequenceTrigger(0.25, 'mobile');
    });

    return () => {
      mm.revert();
    };
  }, [prefersReducedMotion, drawAtProgress]);

  const resolvedCaptionIdx = prefersReducedMotion ? 0 : activeCaptionIdx;

  return (
    <main
      id="hero"
      ref={trackRef}
      className={
        prefersReducedMotion
          ? 'relative w-full h-[100dvh] bg-[#050507] text-[#F4F5F7]'
          : 'relative w-full h-[460vh] md:h-[520vh] bg-[#050507] text-[#F4F5F7]'
      }
      aria-label="APEX R-01 continuous studio camera sequence"
    >
      {/* Pinned Cinema Stage */}
      <section
        ref={stageRef}
        className="relative w-full h-[100dvh] overflow-hidden bg-[#050507] touch-pan-y"
        aria-roledescription="cinematic automotive sequence"
      >
        {/* Main GPU-composited Canvas Sequence */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full block transition-opacity duration-500 ${
            isReady && !hasError ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="APEX R-01 metallic graphite sports coupe studio sequence"
        />

        {/* Zero-Broken-Image / Pre-decode Studio Fallback */}
        {(!isReady || hasError) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 bg-[radial-gradient(ellipse_at_50%_42%,rgba(42,46,56,0.42),#050507_72%)]"
            role={hasError ? 'img' : undefined}
            aria-label="APEX R-01 dark architectural studio backdrop"
          >
            <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6" />
            <p className="font-display text-3xl md:text-5xl font-bold tracking-[0.16em] text-[#F4F5F7]">
              APEX R-01
            </p>
            {hasError && (
              <p className="mt-3 text-sm text-[#9CA3AF]">
                Studio master plate unavailable.
              </p>
            )}
          </div>
        )}

        {/* Restrained directional scrims for navbar & caption legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050507]/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-32 bg-gradient-to-t from-[#050507]/85 via-[#050507]/35 to-transparent"
        />

        {/* Synchronized Cinematic Caption Layer */}
        <div className="pointer-events-none select-none absolute inset-0 z-20">
          {HERO_CAPTIONS.map((caption, index) => {
            const isActive = resolvedCaptionIdx === index;
            const isRight = caption.desktopAlign === 'right';
            const transitionClass = prefersReducedMotion
              ? 'transition-none'
              : 'transition-[opacity,transform] duration-500 ease-out';

            return (
              <div
                key={caption.id}
                aria-hidden={caption.isPrimaryHeading ? undefined : !isActive}
                className={`absolute bottom-7 left-5 right-5 md:bottom-10 md:left-12 md:right-12 flex flex-col ${
                  isRight
                    ? 'items-start text-left md:items-end md:text-right'
                    : 'items-start text-left'
                } ${transitionClass} ${
                  isActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                }`}
              >
                <div
                  aria-hidden={caption.isPrimaryHeading ? !isActive : undefined}
                  className={`flex items-center gap-2.5 ${
                    isRight ? 'md:flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-[1px] w-4 bg-[#D91E2A]/85"
                  />
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF]">
                    {caption.subtitle}
                  </p>
                </div>

                {caption.isPrimaryHeading ? (
                  <h1 className="mt-1.5 font-display text-2xl md:text-4xl font-semibold tracking-[0.1em] text-[#F4F5F7] leading-none">
                    {caption.title}
                  </h1>
                ) : (
                  <p className="mt-1.5 font-display text-xl md:text-3xl font-semibold tracking-[0.06em] text-[#F4F5F7] leading-none">
                    {caption.title}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
