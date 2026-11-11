import React, { useEffect, useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { ThemeProvider } from './utils/theme';

const ExperienceMap3D = lazy(() => import('./components/ExperienceMap3D'));
const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sectionIds = ['home', 'experience', 'projects', 'skills', 'about', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 }
    );

    const observeSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };

    observeSections();
    const timer = window.setTimeout(observeSections, 600);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="relative bg-surface-bg text-content-primary min-h-screen overflow-x-hidden transition-colors duration-300">
        {/* Soft Atmospheric Top Dome & Perspective Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-[680px] z-0 bg-vercel-atmosphere"
        />

        <Cursor />

        <Navbar activeSection={activeSection} />

        <main className="relative z-10">
          <Hero />
          <Suspense fallback={<div className="min-h-[420px]" />}>
            <ExperienceMap3D />
            <Projects />
            <Skills />
            <About />
            <Contact />
          </Suspense>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
