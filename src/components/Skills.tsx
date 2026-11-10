import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt3DCard from './Tilt3DCard';

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const skillCategories = [
    {
      title: 'Frontend Development',
      content:
        'Building responsive web applications with React, TypeScript, and modern CSS frameworks.',
      skills: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'],
    },
    {
      title: 'Backend Development',
      content:
        'Developing robust backend systems with Node.js, Express, Python, Django and various databases.',
      skills: ['Node.js', 'Express', 'Python / Django', 'PostgreSQL', 'MongoDB'],
    },
    {
      title: 'Mobile Development',
      content:
        'Creating cross-platform mobile apps with React Native, Flutter and native technologies.',
      skills: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)'],
    },
    {
      title: 'Full Stack Solutions',
      content:
        'End-to-end development from database design to frontend implementation.',
      skills: ['Git / GitHub', 'Docker', 'AWS', 'CI/CD', 'Testing'],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-bento-card', {
        y: 34,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-content-primary mb-8">
        Skills
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {skillCategories.map((category, idx) => {
          const isHovered = hoveredIdx === idx;
          const spanClass =
            idx === 0 || idx === 3 ? 'lg:col-span-7' : 'lg:col-span-5';

          return (
            <div
              key={category.title}
              className={`${spanClass} skill-bento-card`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Tilt3DCard intensity={5} glare={true}>
                <div className="geist-card p-8 sm:p-10 h-full flex flex-col justify-between group">
                  {/* Interactive Vercel Geometric Schematic Accent */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 160 160"
                    className={`pointer-events-none absolute -right-6 -top-6 w-40 h-40 transition-transform duration-700 ${
                      isHovered ? 'scale-110 rotate-12 opacity-40' : 'opacity-15'
                    }`}
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      fill="none"
                      stroke="var(--brand-primary)"
                      strokeWidth="1.5"
                      strokeDasharray={idx % 2 === 0 ? '4 4' : undefined}
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="36"
                      fill="none"
                      stroke="var(--brand-primary)"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="20"
                      y1="80"
                      x2="140"
                      y2="80"
                      stroke="var(--brand-primary)"
                      strokeWidth="1"
                    />
                    <line
                      x1="80"
                      y1="20"
                      x2="80"
                      y2="140"
                      stroke="var(--brand-primary)"
                      strokeWidth="1"
                    />
                  </svg>

                  <div className="mb-8 relative z-10">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-content-primary mb-3">
                      {category.title}
                    </h3>
                    <p className="text-base text-content-secondary leading-relaxed max-w-xl">
                      {category.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 relative z-30">
                    {category.skills.map((skill) => (
                      <span key={skill} className="geist-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Tilt3DCard>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
