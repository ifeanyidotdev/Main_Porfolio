import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt3DCard from './Tilt3DCard';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  'Got my CyberSecurity Certification from Google',
  'Speaker at Flutter Conference 2024',
  'Open-source contributor',
];

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-animate', {
        y: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
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
      id="about"
      ref={sectionRef}
      className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-24"
    >
      <div className="mb-12 about-animate space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-container text-brand-onContainer border border-brand-border font-mono text-xs font-semibold">
          Background
        </span>
        <h2 className="font-display section-fluid-title font-bold text-content-primary">
          About Me
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 about-animate">
          <Tilt3DCard intensity={4} glare={true}>
            <div className="geist-card p-8 sm:p-12 xl:p-14 h-full flex flex-col justify-center space-y-6 relative">
              <span className="geist-crosshair top-3 left-3" />
              <span className="geist-crosshair top-3 right-3" />
              <p className="text-lg sm:text-xl xl:text-2xl text-content-primary leading-relaxed font-medium">
                I’m a passionate fullstack developer with over half a decade of experience building
                web and mobile applications. My journey in software development began before
                college, where I discovered my love for creating interactive digital experiences.
              </p>
              <p className="text-base sm:text-lg xl:text-xl text-content-secondary leading-relaxed">
                I specialize in building robust, scalable applications using modern frameworks and
                best practices. My goal is to create software that not only functions flawlessly but
                also provides an exceptional user experience.
              </p>
            </div>
          </Tilt3DCard>
        </div>

        <div className="lg:col-span-5 about-animate">
          <Tilt3DCard intensity={4} glare={true}>
            <div className="geist-card p-8 sm:p-12 xl:p-14 h-full flex flex-col justify-between bg-surface-elevated">
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-content-primary mb-6">
                Achievements
              </h3>
              <ul className="space-y-3.5 relative z-30">
                {achievements.map((item) => (
                  <li
                    key={item}
                    className="group flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-surface-card hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-all duration-200 cursor-default"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-fill group-hover:bg-surface-bg transition-colors shrink-0" />
                    <span className="font-medium text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Tilt3DCard>
        </div>
      </div>
    </section>
  );
};

export default About;
