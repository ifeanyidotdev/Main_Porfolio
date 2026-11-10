import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import Tilt3DCard from './Tilt3DCard';

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveLink: string;
  githubLink: string;
}

interface ProjectProps {
  project: ProjectItem;
  spanClass?: string;
  activeTag?: string | null;
  onHoverTag?: (tag: string | null) => void;
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const ProjectFallbackArtwork: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const host = getHostname(project.liveLink);
  const variant = project.id % 4;

  return (
    <div className="w-full h-full relative overflow-hidden bg-surface-elevated flex flex-col justify-between p-5 sm:p-6 select-none">
      {/* Subtle Grid Background Inside Artwork */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Interactive Geometric Schematic SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 240"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
      >
        {variant === 1 && (
          <>
            <circle
              cx="315"
              cy="115"
              r="76"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              fill="var(--brand-container)"
              fillOpacity="0.45"
            />
            <polygon
              points="315,52 372,150 258,150"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              fill="var(--brand-fill)"
              fillOpacity="0.2"
            />
            <circle cx="315" cy="52" r="5" fill="var(--brand-primary)" />
            <circle cx="372" cy="150" r="5" fill="var(--brand-primary)" />
            <circle cx="258" cy="150" r="5" fill="var(--brand-primary)" />
          </>
        )}

        {variant === 2 && (
          <>
            <circle
              cx="310"
              cy="120"
              r="82"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
              fill="var(--brand-container)"
              fillOpacity="0.4"
            />
            <circle
              cx="310"
              cy="120"
              r="46"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 190 175 Q 250 65 345 105"
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="190" cy="175" r="6" fill="var(--brand-fill)" />
            <circle cx="345" cy="105" r="7" fill="var(--brand-primary)" />
          </>
        )}

        {variant === 3 && (
          <>
            <rect
              x="225"
              y="45"
              width="140"
              height="140"
              rx="16"
              transform="rotate(15 295 115)"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              fill="var(--brand-container)"
              fillOpacity="0.45"
            />
            <circle
              cx="295"
              cy="115"
              r="38"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              fill="var(--bg-primary)"
            />
            <polygon
              points="295,88 308,125 295,116 282,125"
              fill="var(--brand-primary)"
            />
          </>
        )}

        {variant === 0 && (
          <>
            <circle
              cx="275"
              cy="115"
              r="62"
              stroke="var(--brand-primary)"
              strokeWidth="1.5"
              fill="var(--brand-container)"
              fillOpacity="0.45"
            />
            <circle
              cx="330"
              cy="115"
              r="62"
              stroke="var(--brand-primary)"
              strokeWidth="2"
              fill="var(--brand-fill)"
              fillOpacity="0.2"
            />
          </>
        )}
      </svg>

      {/* Top Row: Live Domain Pill */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-brand-border">
          <span className="h-2 w-2 rounded-full bg-brand-fill" />
          <span className="text-xs font-mono font-medium text-content-primary truncate max-w-[180px]">
            {host}
          </span>
        </div>
      </div>

      {/* Bottom Row: Clean Project Title Lockup (No Tools/Tags in Artwork) */}
      <div className="relative z-10 mt-auto">
        <div className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-content-primary leading-tight">
          {project.title}
        </div>
      </div>
    </div>
  );
};

const ProjectCard: React.FC<ProjectProps> = ({
  project,
  spanClass = 'lg:col-span-6',
  activeTag,
  onHoverTag,
}) => {
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setImageError(true);
    }
  }, []);

  const isHighlightedByTag = activeTag ? project.tags.includes(activeTag) : false;

  return (
    <div className={`project-card-item ${spanClass}`}>
      <Tilt3DCard intensity={5} glare={true}>
        <article
          className={`geist-card group p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-300 ${
            isHighlightedByTag ? 'ring-2 ring-brand-primary' : ''
          }`}
        >
          <div>
            {/* 3D Floating Preview Frame */}
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden bg-surface-elevated mb-6 border border-brand-border translate-z-20">
              {!imageError ? (
                <img
                  ref={imgRef}
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <ProjectFallbackArtwork project={project} />
              )}
            </div>

            <div className="px-0.5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-content-primary">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 shrink-0">
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} source code`}
                      className="h-11 w-11 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-all"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title}`}
                    className="h-11 w-11 rounded-full flex items-center justify-center bg-brand-fill text-brand-onPrimary hover:brightness-110 transition-all"
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              <p className="text-base text-content-secondary leading-relaxed mb-6">
                {project.description}
              </p>
            </div>
          </div>

          <div className="px-0.5 flex flex-wrap gap-2 relative z-30">
            {project.tags.map((tag) => {
              const isTagHighlighted = activeTag === tag;
              return (
                <span
                  key={tag}
                  onMouseEnter={() => onHoverTag?.(tag)}
                  onMouseLeave={() => onHoverTag?.(null)}
                  className={`geist-chip ${
                    isTagHighlighted
                      ? '!bg-brand-fill !text-brand-onPrimary !border-brand-fill scale-105'
                      : ''
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </article>
      </Tilt3DCard>
    </div>
  );
};

export default ProjectCard;
