import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, X } from 'lucide-react';
import { FOOTER_COPYRIGHT, SOCIAL_LINKS } from '../utils/constant';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-elevated border-t border-brand-border py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <a
            href="#home"
            className="group inline-flex items-center gap-2.5 font-display text-xl sm:text-2xl font-bold tracking-tight text-content-primary hover:opacity-85 transition-opacity"
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

          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a
              href="#home"
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#experience"
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              Projects
            </a>
            <a
              href="#skills"
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              Skills
            </a>
            <a
              href="#about"
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-content-secondary hover:text-content-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="h-9 w-9 rounded-xl flex items-center justify-center bg-surface-card hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="h-9 w-9 rounded-xl flex items-center justify-center bg-surface-card hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.twitter.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="h-9 w-9 rounded-xl flex items-center justify-center bg-surface-card hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
            >
              <X className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.email.url}
              aria-label="Email"
              className="h-9 w-9 rounded-xl flex items-center justify-center bg-surface-card hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href="#home"
              aria-label="Back to top"
              className="ml-2 h-9 w-9 rounded-xl flex items-center justify-center bg-brand-fill text-brand-onPrimary hover:brightness-110 transition-all"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border text-center text-sm text-content-secondary">
          <p>&copy; {FOOTER_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
