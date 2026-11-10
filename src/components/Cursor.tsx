import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Cursor: React.FC = () => {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const halo = haloRef.current;
    if (!halo) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarsePointer) return;

    // Animate transform (x, y) via GSAP quickTo to keep motion on the compositor thread
    const xTo = gsap.quickTo(halo, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(halo, 'y', { duration: 0.45, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX - 16);
      yTo(e.clientY - 16);
      halo.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      halo.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={haloRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-borderStrong/50 bg-content-primary/5 pointer-events-none z-50 opacity-0 transition-opacity duration-300 hidden md:block"
    />
  );
};

export default Cursor;
