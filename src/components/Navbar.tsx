import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../utils/theme';

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { name: 'Home', id: 'home' },
  { name: 'Experience', id: 'experience' },
  { name: 'Projects', id: 'projects' },
  { name: 'Skills', id: 'skills' },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' },
];

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { resolvedTheme, toggleTheme } = useTheme();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const pillIndicatorRef = useRef<HTMLSpanElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
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
    resolvedTheme === 'dark' ? 'Switch to white theme' : 'Switch to dark theme';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-glass backdrop-blur-xl border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Custom Monogram Brand Mark */}
        <a
          href="#home"
          className="group inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-content-primary"
        >
          <span className="h-7 w-7 rounded-md bg-brand-fill text-brand-onPrimary font-mono text-xs font-bold flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            IS
          </span>
          <span>Ifeanyi</span>
        </a>

        {/* Interactive Sliding Pill Navigation */}
        <nav
          ref={navContainerRef}
          onMouseLeave={() => setHoveredId(null)}
          className="hidden md:flex items-center relative p-1 rounded-full bg-surface-elevated border border-brand-border"
          aria-label="Primary Navigation"
        >
          <span
            ref={pillIndicatorRef}
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-0 rounded-full bg-brand-fill pointer-events-none opacity-0"
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
                    ? 'text-brand-onPrimary font-semibold'
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
            className="h-9 w-9 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
            aria-label={nextThemeLabel}
            title={nextThemeLabel}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden h-9 w-9 rounded-full flex items-center justify-center bg-surface-elevated text-content-primary border border-brand-border focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-surface-bg px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-fill text-brand-onPrimary'
                    : 'text-content-secondary hover:bg-surface-elevated hover:text-content-primary'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
