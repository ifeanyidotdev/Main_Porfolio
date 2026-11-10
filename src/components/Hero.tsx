import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { Github, Linkedin, Mail, ArrowUpRight, X } from 'lucide-react';
import { SOCIAL_LINKS } from '../utils/constant';
import { useTheme } from '../utils/theme';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // GSAP Entrance & Magnetic Button Physics
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-word', {
        y: 36,
        rotateX: -35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
      }).from(
        '.hero-cell',
        {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
        },
        '-=0.45'
      );

      const magneticButtons = gsap.utils.toArray<HTMLElement>('.magnetic-el');
      magneticButtons.forEach((btn) => {
        const xTo = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
        const yTo = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          xTo(dx * 0.2);
          yTo(dy * 0.2);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Interactive Three.js 3D Cobalt-Sky Architectural Prism Sculpture
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isDark = resolvedTheme === 'dark';

    const scene = new THREE.Scene();
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.25 : 1.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.8 : 2.1);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0xa78bfa : 0x7c3aed, 2.8);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    const indigoLight = new THREE.PointLight(0x6366f1, isDark ? 2.2 : 1.1, 12);
    indigoLight.position.set(3, -3, 3);
    scene.add(indigoLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Inner Faceted Octahedral Core
    const coreGeo = new THREE.OctahedronGeometry(1.38, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x6d28d9 : 0x5b21b6,
      emissive: isDark ? 0x4c1d95 : 0x3b0764,
      emissiveIntensity: isDark ? 0.55 : 0.25,
      roughness: 0.18,
      metalness: 0.35,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Outer Geodesic Wireframe Lattice
    const cageGeo = new THREE.OctahedronGeometry(1.78, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xa78bfa : 0x6d28d9,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.62 : 0.45,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    // 3. Dual Gyroscopic Orbital Rings
    const ringGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xa78bfa : 0x6d28d9,
      transparent: true,
      opacity: isDark ? 0.72 : 0.52,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    rootGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.015, 16, 128), ringMat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    rootGroup.add(ring2);

    // 4. Interactive Orbiting Nodes
    const nodeGeo = new THREE.OctahedronGeometry(0.16, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xffffff : 0x4c1d95,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.8,
      roughness: 0.15,
    });
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      rootGroup.add(node);
      nodes.push(node);
    }

    // 5. 3D Starfield Particle Constellation
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0xc4b5fd : 0x6d28d9,
      size: 0.052,
      transparent: true,
      opacity: isDark ? 0.75 : 0.55,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particleCloud);

    let targetRotX = 0;
    let targetRotY = 0;
    const spinBoost = { value: 1 };

    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = normX * 0.75;
      targetRotX = normY * 0.55;
    };

    const handleCanvasClick = () => {
      gsap.fromTo(
        spinBoost,
        { value: 6 },
        { value: 1, duration: 1.2, ease: 'power3.out' }
      );
      gsap.fromTo(
        coreMesh.scale,
        { x: 1.28, y: 1.28, z: 1.28 },
        { x: 1, y: 1, z: 1, duration: 0.9, ease: 'elastic.out(1, 0.4)' }
      );
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    const domElem = renderer.domElement;
    domElem.addEventListener('click', handleCanvasClick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      coreMesh.rotation.y += 0.008 * spinBoost.value;
      coreMesh.rotation.x += 0.005 * spinBoost.value;

      cageMesh.rotation.y -= 0.005 * spinBoost.value;
      cageMesh.rotation.z += 0.004 * spinBoost.value;

      particleCloud.rotation.y = t * 0.08;
      particleCloud.rotation.x = Math.sin(t * 0.2) * 0.15;

      ring1.rotation.z = t * 0.35;
      ring2.rotation.z = -t * 0.28;

      nodes.forEach((node, idx) => {
        const angle = t * 0.85 + (idx * Math.PI) / 2;
        node.position.set(
          Math.cos(angle) * 2.3,
          Math.sin(angle * 1.3) * 0.85,
          Math.sin(angle) * 2.3
        );
        node.rotation.y = t * 2;
      });

      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.07;
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.07;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      domElem.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [resolvedTheme]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(650px circle at ${x}px ${y}px, rgba(124, 58, 237, 0.14), transparent 65%)`;
    spotlightRef.current.style.opacity = '1';
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="min-h-screen-dynamic pt-24 pb-10 flex flex-col justify-center"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Google M3 Full-Screen Expressive Bento Stage */}
        <div
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => {
            if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
          }}
          className="relative border border-brand-border bg-surface-card rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Corner Crosshairs (+) */}
          <span className="geist-crosshair top-3 left-3" />
          <span className="geist-crosshair top-3 right-3" />
          <span className="geist-crosshair bottom-3 left-3" />
          <span className="geist-crosshair bottom-3 right-3" />

          {/* Animated Grid Laser Beam */}
          <div className="geist-grid-beam top-0 left-0" />

          {/* Cursor-Tracking Radial Spotlight */}
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-0"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-brand-border min-h-[calc(100dvh-8.5rem)]">
            {/* Left Full-Height Expressive Stage */}
            <div className="hero-cell lg:col-span-7 p-7 sm:p-12 lg:p-14 xl:p-20 flex flex-col justify-between gap-10">
              <div className="space-y-7 perspective-1200">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-container text-brand-onContainer border border-brand-border font-mono text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-purple-600 bg-brand-fill animate-pulse" />
                    <span>Software Engineer</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-elevated text-content-secondary border border-brand-border font-mono text-xs">
                    Full-Stack • Mobile • Cloud
                  </span>
                </div>

                <h1 className="font-display hero-fluid-title font-bold text-content-primary">
                  <span className="hero-word inline-block mr-3 sm:mr-4">Ifeanyichukwu</span>
                  <span className="hero-word inline-block text-brand-primary">Sampson</span>
                </h1>

                <p className="text-lg sm:text-xl xl:text-2xl text-content-secondary max-w-2xl leading-relaxed">
                  Fullstack and mobile software engineer crafting resilient backends and
                  cross-platform applications with Python, Django, Node.js, and Flutter.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <a
                      href={`${SOCIAL_LINKS.github.url}?tab=repositories`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="magnetic-el geist-btn-primary group"
                    >
                      <span>View Projects</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a href="#contact" className="magnetic-el geist-btn-secondary">
                      <span>Contact Me</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href={SOCIAL_LINKS.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="magnetic-el h-11 w-11 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border hover:border-brand-fill transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href={SOCIAL_LINKS.linkedin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="magnetic-el h-11 w-11 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border hover:border-brand-fill transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={SOCIAL_LINKS.twitter.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                      className="magnetic-el h-11 w-11 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border hover:border-brand-fill transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </a>
                    <a
                      href={SOCIAL_LINKS.email.url}
                      aria-label="Email"
                      className="magnetic-el h-11 w-11 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border hover:border-brand-fill transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Google M3 Tonal Engineering Highlights Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-brand-border">
                {[
                  { value: '5+ Yrs', label: 'Engineering' },
                  { value: '4+', label: 'Ventures Shipped' },
                  { value: 'Full-Stack', label: 'Python • Node • Go' },
                  { value: 'Mobile', label: 'Flutter • Native' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="group p-4 rounded-2xl bg-surface-elevated hover:bg-brand-container border border-brand-border transition-all duration-200"
                  >
                    <div className="font-display text-xl sm:text-2xl font-bold text-content-primary group-hover:text-brand-primary transition-colors">
                      {stat.value}
                    </div>
                    <div className="font-mono text-xs text-content-secondary mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Full-Height Interactive 3D Prism Stage */}
            <div className="hero-cell lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between relative bg-surface-elevated min-h-[440px] lg:min-h-full overflow-hidden">
              {/* Top Floating Google M3 Glass Pill */}
              <div className="relative z-20 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card/90 backdrop-blur-md border border-brand-border font-mono text-xs text-content-secondary">
                  <span className="h-2 w-2 rounded-full bg-brand-primary" />
                  Interactive 3D • Click to Pulse
                </span>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-brand-container text-brand-onContainer font-mono text-[11px] font-semibold">
                  60 FPS WebGL
                </span>
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 m-auto w-80 h-80 rounded-full blur-3xl opacity-20"
                style={{
                  background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
                }}
              />

              <div
                ref={canvasMountRef}
                className="relative z-10 w-full h-[360px] sm:h-[440px] lg:h-[480px] my-auto cursor-pointer"
                title="Click to pulse 3D prism"
                aria-label="Interactive 3D prism sculpture"
              />

              {/* Bottom Production Ventures Dock */}
              <div className="relative z-20 pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-content-muted">
                  Shipped For
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {['Meghee LLC.', 'Blucera Inc', 'Dora', 'KaboCash'].map((company) => (
                    <a
                      key={company}
                      href="#experience"
                      className="px-3 py-1 rounded-full bg-surface-card hover:bg-brand-fill text-content-secondary hover:text-white border border-brand-border text-xs font-medium transition-colors"
                    >
                      {company}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
