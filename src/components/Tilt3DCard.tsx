import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  intensity = 6,
  glare = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3.out' });
    const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(card, 'scale', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -intensity;
      const rotateY = ((x - centerX) / centerX) * intensity;

      rotateXTo(rotateX);
      rotateYTo(rotateY);
      scaleTo(1.01);

      if (glare && spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(520px circle at ${x}px ${y}px, color-mix(in srgb, var(--brand-primary) 7%, transparent), transparent 60%)`;
        spotlightRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
      scaleTo(1);
      if (glare && spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, glare]);

  return (
    <div className="perspective-1200 h-full">
      <div
        ref={cardRef}
        className={`preserve-3d relative h-full ${className}`}
        style={{ transformPerspective: 1200 }}
      >
        {glare && (
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute inset-0 rounded-[12px] opacity-0 transition-opacity duration-300 z-20"
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default Tilt3DCard;
