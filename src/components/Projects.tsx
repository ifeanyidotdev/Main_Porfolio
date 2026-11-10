import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight } from 'lucide-react';
import ProjectCard, { ProjectItem } from './ProjectCard';
import { SOCIAL_LINKS } from '../utils/constant';

gsap.registerPlugin(ScrollTrigger);

const projects: ProjectItem[] = [
  {
    id: 1,
    title: 'Blucera',
    description:
      'Blucera is a pioneering digital technology company dedicated to empowering individuals, businesses, and communities and beyond.',
    image:
      'https://www.blucera.com/_next/image?url=%2Fassets%2Fimages%2FhomeWinGPT-Img.png&w=3840&q=75',
    tags: ['Python', 'Django', 'Postgres', 'Redis', 'Docker', 'Kafka', 'AWS'],
    liveLink: 'https://www.blucera.com/',
    githubLink: '#',
  },
  {
    id: 2,
    title: 'Dora',
    description:
      'Dora is a technology company that provides a comprehensive delivery management platform designed to empower logistics businesses and e-commerce operators.',
    image:
      'https://usedora.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrjesruj%2Fimage%2Fupload%2Fv1728901685%2FDora%2520Website%2FDora_App_kvnu52.png&w=3840&q=75',
    tags: ['Flutter', 'Firebase'],
    liveLink: 'https://usedora.com/',
    githubLink: '#',
  },
  {
    id: 3,
    title: 'Sorom',
    description:
      'Looking for a fun, easy way to share your hidden travel gems and uncover new adventures around the globe.',
    image: 'https://framerusercontent.com/images/B7ej9Ddz3op5OJue49SKFyFPo.png',
    tags: ['Flutter', 'Firebase', 'Graphql', 'PostgreSQL', 'Node.js', 'Express'],
    liveLink: 'https://www.sorom.co/',
    githubLink: '#',
  },
  {
    id: 4,
    title: 'KaboCash',
    description:
      'KaboCash Technologies is a pioneering fintech company specializing in secure, seamless, and cost-effective cross-border money transfers across Africa and beyond.',
    image: 'https://www.kabocash.com/send-money-with-kabocash-with-base.webp',
    tags: ['Flutter', 'Firebase', 'Node.js', 'Socket.io'],
    liveLink: 'https://www.kabocash.com/',
    githubLink: '#',
  },
];

const spanClasses = [
  'lg:col-span-7',
  'lg:col-span-5',
  'lg:col-span-5',
  'lg:col-span-7',
];

const filterOptions = ['All', 'Flutter', 'Firebase', 'Python', 'Node.js'];

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const visibleProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) =>
          p.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()))
        );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card-item', {
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
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
    <section
      id="projects"
      ref={sectionRef}
      className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-24"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-container text-brand-onContainer border border-brand-border font-mono text-xs font-semibold">
            Featured Work
          </span>
          <h2 className="font-display section-fluid-title font-bold text-content-primary">
            Selected Projects
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Google M3 Filter Pill Group */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-surface-elevated border border-brand-border">
            {filterOptions.map((option) => {
              const isSelected = activeFilter === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveFilter(option)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-700 bg-brand-fill text-white shadow-sm'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <a
            href={`${SOCIAL_LINKS.github.url}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="geist-btn-secondary self-start sm:self-auto group"
          >
            <Github className="h-4 w-4" />
            <span>More on GitHub</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {visibleProjects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            spanClass={
              visibleProjects.length === 1
                ? 'lg:col-span-12'
                : spanClasses[idx % spanClasses.length]
            }
            activeTag={hoveredTag}
            onHoverTag={setHoveredTag}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
