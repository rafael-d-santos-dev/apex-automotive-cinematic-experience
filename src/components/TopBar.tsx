import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';

type SectionId = 'hero' | 'design' | 'engineering' | 'performance' | 'reveal';

interface NavLinkItem {
  id: Exclude<SectionId, 'hero'>;
  label: string;
  href: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { id: 'design', label: 'DESIGN', href: '#design' },
  { id: 'engineering', label: 'ENGINEERING', href: '#engineering' },
  { id: 'performance', label: 'PERFORMANCE', href: '#performance' },
  { id: 'reveal', label: 'DOSSIER', href: '#reveal' },
];

const SECTION_ORDER: SectionId[] = [
  'hero',
  'design',
  'engineering',
  'performance',
  'reveal',
];

export function TopBar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Lightweight passive scroll spy respecting GSAP pinned Hero track
  useEffect(() => {
    let rafId: number | null = null;

    const updateActiveSection = () => {
      rafId = null;

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 40;

      if (atBottom) {
        setActiveSection((prev) => (prev !== 'reveal' ? 'reveal' : prev));
        return;
      }

      const threshold = Math.max(96, window.innerHeight * 0.35);
      let nextSection: SectionId = 'hero';

      for (let i = SECTION_ORDER.length - 1; i >= 0; i--) {
        const id = SECTION_ORDER[i];
        const el = document.getElementById(id);
        if (!el) continue;

        if (el.getBoundingClientRect().top <= threshold) {
          nextSection = id;
          break;
        }
      }

      setActiveSection((prev) => (prev !== nextSection ? nextSection : prev));
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  // Close mobile menu on Escape, outside click, or desktop breakpoint resize
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const navigateToSection = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, targetId: SectionId) => {
      event.preventDefault();
      setIsMenuOpen(false);

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

      if (targetId === 'hero') {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const headerOffset = window.innerWidth >= 768 ? 56 : 48;
      const targetTop = Math.max(
        0,
        targetEl.getBoundingClientRect().top + window.scrollY - headerOffset
      );

      window.scrollTo({ top: targetTop, behavior });
    },
    []
  );

  return (
    <div ref={navContainerRef} className="fixed top-0 left-0 right-0 z-40">
      <header
        className="h-12 md:h-14 px-5 md:px-12 flex items-center justify-between gap-4 bg-gradient-to-b from-[#050507]/85 via-[#050507]/45 to-transparent"
        aria-label="Campaign navigation"
      >
        {/* Left: APEX R-01 Wordmark linking to Hero */}
        <a
          href="#hero"
          onClick={(e) => navigateToSection(e, 'hero')}
          aria-current={activeSection === 'hero' ? 'location' : undefined}
          className="font-display text-lg md:text-xl font-bold tracking-[0.16em] text-[#F4F5F7] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91E2A]"
        >
          APEX R-01
        </a>

        {/* Right: Desktop understated section navigation */}
        <nav
          className="hidden md:flex items-center gap-7"
          aria-label="Page sections"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => navigateToSection(e, item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-2 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D91E2A] ${
                  isActive
                    ? 'text-[#F4F5F7]'
                    : 'text-[#9CA3AF] hover:text-[#F4F5F7]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0.5 h-[1.5px] bg-[#D91E2A] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Mobile compact menu toggle (>= 44x44px touch target) */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] -mr-2 text-[#F4F5F7] hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91E2A]"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Mobile vertical dark menu */}
      {isMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile page sections"
          className="md:hidden w-full bg-[#050507]/95 backdrop-blur-md border-b border-white/10 px-5 py-2 flex flex-col"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => navigateToSection(e, item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`min-h-[44px] flex items-center justify-between text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D91E2A] ${
                  isActive
                    ? 'text-[#F4F5F7]'
                    : 'text-[#9CA3AF] hover:text-[#F4F5F7]'
                }`}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`h-[1.5px] w-4 bg-[#D91E2A] transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
