import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import {
  Sun,
  Moon,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  X as XIcon,
  Home,
  Briefcase,
  FolderGit2,
  Cpu,
  User,
  Send,
} from 'lucide-react';
import { useTheme } from '../utils/theme';
import { SOCIAL_LINKS } from '../utils/constant';

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { name: 'Home', id: 'home', num: '01', icon: Home },
  { name: 'Experience', id: 'experience', num: '02', icon: Briefcase },
  { name: 'Projects', id: 'projects', num: '03', icon: FolderGit2 },
  { name: 'Skills', id: 'skills', num: '04', icon: Cpu },
  { name: 'About', id: 'about', num: '05', icon: User },
  { name: 'Contact', id: 'contact', num: '06', icon: Send },
];

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { resolvedTheme, toggleTheme } = useTheme();

  const navContainerRef = useRef<HTMLDivElement>(null);
  const pillIndicatorRef = useRef<HTMLSpanElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const targetId = hoveredId ?? activeSection;

  const updateIndicator = useCallback(() => {
    const targetEl = linkRefs.current[targetId];
    const indicator = pillIndicatorRef.current;
    const container = navContainerRef.current;
    if (!targetEl || !indicator || !container) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    gsap.to(indicator, {
      x: targetRect.left - containerRect.left,
      width: targetRect.width,
      opacity: 1,
      duration: 0.28,
      ease: 'power3.out',
    });
  }, [targetId]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0 && scrollBarRef.current) {
            const pct = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
            scrollBarRef.current.style.width = `${pct}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen || !mobileMenuRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, scale: 0.94, y: -10, transformOrigin: 'top right' },
        { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'back.out(1.5)' }
      );

      gsap.fromTo(
        '.mobile-nav-item',
        { opacity: 0, x: -16, scale: 0.96 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.34,
          stagger: 0.045,
          ease: 'power3.out',
          delay: 0.05,
        }
      );

      gsap.fromTo(
        '.mobile-nav-footer',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', delay: 0.22 }
      );
    }, mobileMenuRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  const handleThemeClick = () => {
    if (themeBtnRef.current) {
      gsap.fromTo(
        themeBtnRef.current,
        { rotate: -90, scale: 0.85 },
        { rotate: 0, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }
      );
    }
    toggleTheme();
  };

  const nextThemeLabel =
    resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-glass backdrop-blur-xl border-b border-brand-border">
      {/* Top Scroll Progress Line */}
      <div
        ref={scrollBarRef}
        aria-hidden="true"
        className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-400 transition-[width] duration-150"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Interactive Triangle Brand Mark */}
        <a
          href="#home"
          className="group inline-flex items-center gap-2.5 font-display text-xl sm:text-2xl font-bold tracking-tight text-content-primary"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700 text-brand-primary transition-transform duration-300 group-hover:rotate-180"
            fill="currentColor"
          >
            <path d="M12 2L22 20H2L12 2Z" />
          </svg>
          <span>Ifeanyi</span>
        </a>

        {/* Google M3 Interactive Sliding Pill Navigation */}
        <nav
          ref={navContainerRef}
          onMouseLeave={() => setHoveredId(null)}
          className="hidden md:flex items-center relative p-1.5 rounded-full bg-surface-elevated border border-brand-border shadow-sm"
          aria-label="Primary Navigation"
        >
          <span
            ref={pillIndicatorRef}
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-purple-700 bg-brand-fill pointer-events-none opacity-0 shadow-sm"
          />
          {navLinks.map((link) => {
            const isHighlighted = targetId === link.id;
            return (
              <a
                key={link.id}
                ref={(el) => {
                  linkRefs.current[link.id] = el;
                }}
                href={`#${link.id}`}
                onMouseEnter={() => setHoveredId(link.id)}
                className={`relative z-10 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                  isHighlighted
                    ? 'text-white font-semibold'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            ref={themeBtnRef}
            type="button"
            onClick={handleThemeClick}
            className="h-10 w-10 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border hover:border-brand-fill active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Animated Morphing Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden relative h-10 w-10 rounded-full flex items-center justify-center border active:scale-95 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
              isMenuOpen
                ? 'bg-purple-700 bg-brand-fill text-white border-brand-fill shadow-md'
                : 'bg-surface-elevated text-content-primary border-brand-border hover:border-brand-primary'
            }`}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            <div className="w-4 h-3.5 relative flex flex-col justify-between items-center">
              <span
                className={`block h-[2px] w-4 rounded-full bg-current transition-all duration-300 origin-center ${
                  isMenuOpen ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? 'w-0 opacity-0' : 'w-3 self-end'
                }`}
              />
              <span
                className={`block h-[2px] w-4 rounded-full bg-current transition-all duration-300 origin-center ${
                  isMenuOpen ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Interactive Animated Mobile Navigation Sheet */}
      {isMenuOpen && (
        <>
          {/* Click-outside Backdrop Scrim */}
          <div
            aria-hidden="true"
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 h-[calc(100dvh-4rem)] bg-black/45 backdrop-blur-xs z-40 transition-opacity"
          />

          <div className="md:hidden relative z-50 px-4 pt-2 pb-4">
            <div
              id="mobile-navigation-drawer"
              ref={mobileMenuRef}
              className="rounded-[28px] bg-surface-card border border-brand-border shadow-2xl p-4 overflow-hidden relative"
            >
              {/* Subtle Corner Crosshairs */}
              <span className="geist-crosshair top-2.5 left-2.5" />
              <span className="geist-crosshair top-2.5 right-2.5" />

              {/* Navigation Items Grid */}
              <nav className="space-y-1.5" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`mobile-nav-item group flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                        isActive
                          ? 'bg-purple-700 bg-brand-fill text-white border-brand-fill shadow-md'
                          : 'bg-surface-elevated/80 hover:bg-brand-container text-content-primary border-brand-border hover:border-brand-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-surface-card text-brand-primary group-hover:bg-brand-fill group-hover:text-white border border-brand-border'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </span>
                        <span className="font-display text-base font-bold leading-tight">
                          {link.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        )}
                        <ArrowUpRight
                          className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                            isActive ? 'text-white' : 'text-content-muted group-hover:text-brand-primary'
                          }`}
                        />
                      </div>
                    </a>
                  );
                })}
              </nav>

              {/* Interactive Mobile Menu Footer with Social Pills & Quick CTA */}
              <div className="mobile-nav-footer mt-4 pt-3.5 border-t border-brand-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={SOCIAL_LINKS.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border active:scale-95 transition-all"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border active:scale-95 transition-all"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.twitter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border active:scale-95 transition-all"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.email.url}
                    aria-label="Email"
                    className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border active:scale-95 transition-all"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>

                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-700 bg-brand-fill text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
