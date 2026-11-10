import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt3DCard from './Tilt3DCard';

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup {
  title: string;
  content: string;
  items: string[];
  span: string;
}

const skillCategories: SkillGroup[] = [
  {
    title: 'Backend Development',
    content:
      'Developing robust backend systems with Node.js, Express, Python, Django and relational or document databases.',
    items: ['Node.js', 'Express', 'Python / Django', 'PostgreSQL', 'MongoDB'],
    span: 'lg:col-span-7',
  },
  {
    title: 'Mobile Development',
    content:
      'Creating cross-platform mobile apps with React Native, Flutter and native technologies.',
    items: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)'],
    span: 'lg:col-span-5',
  },
  {
    title: 'Frontend Development',
    content:
      'Building responsive web applications with React, TypeScript, and modern CSS frameworks.',
    items: ['React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'],
    span: 'lg:col-span-5',
  },
  {
    title: 'Full Stack Solutions',
    content: 'End-to-end development from database design to production deployment.',
    items: ['Git / GitHub', 'Docker', 'AWS', 'CI / CD', 'Testing'],
    span: 'lg:col-span-7',
  },
];

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-bento-card', {
        y: 32,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-24"
    >
      <div className="mb-12 space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-container text-brand-onContainer border border-brand-border font-mono text-xs font-semibold">
          Core Capabilities
        </span>
        <h2 className="font-display section-fluid-title font-bold text-content-primary">
          Skills &amp; Stack
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {skillCategories.map((category, index) => (
          <div key={category.title} className={`skill-bento-card ${category.span}`}>
            <Tilt3DCard intensity={4} glare={true}>
              <div className="geist-card group p-8 sm:p-10 h-full flex flex-col justify-between relative overflow-hidden">
                {/* Interactive Background Schematic */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 240 240"
                  className="pointer-events-none absolute -right-10 -bottom-10 w-52 h-52 opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12"
                >
                  {index % 2 === 0 ? (
                    <>
                      <circle
                        cx="120"
                        cy="120"
                        r="88"
                        fill="none"
                        stroke="var(--brand-primary)"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                      />
                      <circle
                        cx="120"
                        cy="120"
                        r="54"
                        fill="none"
                        stroke="var(--brand-primary)"
                        strokeWidth="2"
                      />
                    </>
                  ) : (
                    <polygon
                      points="120,24 216,192 24,192"
                      fill="none"
                      stroke="var(--brand-primary)"
                      strokeWidth="2"
                    />
                  )}
                </svg>

                <div className="relative z-10">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-content-primary mb-3">
                    {category.title}
                  </h3>
                  <p className="text-base sm:text-lg text-content-secondary leading-relaxed mb-8 max-w-xl">
                    {category.content}
                  </p>
                </div>

                <div className="relative z-30 flex flex-wrap gap-2.5">
                  {category.items.map((item) => {
                    const isSelected = selectedSkill === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSelectedSkill(isSelected ? null : item)}
                        className={`geist-chip ${
                          isSelected
                            ? '!bg-brand-fill !text-brand-onPrimary !border-brand-fill scale-105'
                            : ''
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Tilt3DCard>
          </div>
        ))}
      </div>

      {/* Google M3 Full-Width Interactive Tech Stack Marquee Ribbon */}
      <div className="mt-8 overflow-hidden rounded-full bg-surface-elevated border border-brand-border py-3.5 px-4">
        <div className="animate-marquee gap-4 items-center">
          {[
            'Python',
            'Django',
            'Node.js',
            'TypeScript',
            'React',
            'Flutter',
            'PostgreSQL',
            'Redis',
            'GraphQL',
            'Docker',
            'Kafka',
            'AWS',
            'Firebase',
            'Socket.io',
            'Python',
            'Django',
            'Node.js',
            'TypeScript',
            'React',
            'Flutter',
            'PostgreSQL',
            'Redis',
            'GraphQL',
            'Docker',
            'Kafka',
            'AWS',
            'Firebase',
            'Socket.io',
          ].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card border border-brand-border font-mono text-xs font-medium text-content-primary whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
