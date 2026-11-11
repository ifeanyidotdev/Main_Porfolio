import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceMap3D from './components/ExperienceMap3D';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { ThemeProvider } from './utils/theme';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'experience', 'projects', 'skills', 'about', 'contact'];
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (
            scrollPosition >= offsetTop - 160 &&
            scrollPosition < offsetTop + height - 160
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
          <ExperienceMap3D />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
