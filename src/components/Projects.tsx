import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github } from 'lucide-react';
import ProjectCard, { ProjectItem } from './ProjectCard';
import { SOCIAL_LINKS } from '../utils/constant';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const projects: (ProjectItem & { spanClass: string })[] = [
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
      spanClass: 'lg:col-span-7',
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
      spanClass: 'lg:col-span-5',
    },
    {
      id: 3,
      title: 'Sorom',
      description:
        'Looking for a fun, easy way to share your hidden travel gems and uncover new adventures around the globe.',
      image: 'https://framerusercontent.com/images/B7ej9Ddz3op5OJue49SKFyFPo.png',
      tags: ['Flutter', 'Firebase', 'GraphQL', 'PostgreSQL', 'Node.js', 'Express'],
      liveLink: 'https://www.sorom.co/',
      githubLink: '#',
      spanClass: 'lg:col-span-5',
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
      spanClass: 'lg:col-span-7',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card-reveal', {
        y: 38,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 82%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-content-primary">
          Projects
        </h2>
        <a
          href={`${SOCIAL_LINKS.github.url}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="geist-btn-secondary self-start sm:self-auto"
        >
          <Github className="h-4 w-4" />
          <span>More on GitHub</span>
        </a>
      </div>

      <div className="projects-grid grid grid-cols-1 lg:grid-cols-12 gap-5">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            spanClass={project.spanClass}
            activeTag={activeTag}
            onHoverTag={setActiveTag}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
