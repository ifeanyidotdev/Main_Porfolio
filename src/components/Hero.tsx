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

  // Interactive Three.js 3D Monochrome Architectural Prism Sculpture
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

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.0 : 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 3.2 : 2.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0xd4d4d8 : 0x52525b, 2.2);
    rimLight.position.set(-6, -4, 4);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Matte Carbon / Obsidian Inner Octahedral Core
    const coreGeo = new THREE.OctahedronGeometry(1.38, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x09090b : 0x18181b,
      emissive: isDark ? 0x18181b : 0x09090b,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.65,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 2. Outer Crisp Monochrome Wireframe Lattice
    const cageGeo = new THREE.OctahedronGeometry(1.78, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0x18181b,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.55 : 0.4,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    // 3. Dual Gyroscopic Orbital Rings
    const ringGeo = new THREE.TorusGeometry(2.3, 0.018, 16, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0xa1a1aa : 0x3f3f46,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    rootGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.014, 16, 128), ringMat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    rootGroup.add(ring2);

    // 4. Interactive Orbiting Satellite Nodes
    const nodeGeo = new THREE.OctahedronGeometry(0.15, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xffffff : 0x09090b,
      emissive: isDark ? 0xa1a1aa : 0x27272a,
      emissiveIntensity: 0.6,
      roughness: 0.15,
    });
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      rootGroup.add(node);
      nodes.push(node);
    }

    // 5. Monochrome 3D Starfield Particle Constellation
    const particleCount = 110;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 1.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0xd4d4d8 : 0x3f3f46,
      size: 0.048,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
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
    spotlightRef.current.style.background = `radial-gradient(650px circle at ${x}px ${y}px, color-mix(in srgb, var(--brand-primary) 7%, transparent), transparent 65%)`;
    spotlightRef.current.style.opacity = '1';
  };

  const isDark = resolvedTheme === 'dark';

  return (
    <section id="home" ref={heroRef} className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Architectural Grid Frame */}
        <div
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => {
            if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
          }}
          className="relative border border-brand-border bg-surface-card rounded-2xl overflow-hidden shadow-2xl shadow-black/25"
        >
          {/* Corner Crosshairs (+) */}
          <span className="geist-crosshair -top-1 -left-1" />
          <span className="geist-crosshair -top-1 -right-1" />
          <span className="geist-crosshair -bottom-1 -left-1" />
          <span className="geist-crosshair -bottom-1 -right-1" />

          {/* Animated Monochrome Grid Laser Beam */}
          <div className="geist-grid-beam top-0 left-0" />

          {/* Cursor-Tracking Radial Spotlight */}
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-0"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-brand-border">
            {/* Left Architectural Column */}
            <div className="hero-cell lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
              <div className="space-y-6 perspective-1200">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-container text-brand-onContainer border border-brand-border font-mono text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-brand-fill animate-pulse" />
                  <span>Software Engineer</span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.35rem] font-bold tracking-[-0.04em] leading-[1.04] text-content-primary">
                  <span className="hero-word inline-block mr-3">Ifeanyichukwu</span>
                  <span className="hero-word inline-block text-content-secondary">Sampson</span>
                </h1>

                <p className="text-lg sm:text-xl text-content-secondary max-w-xl leading-relaxed">
                  Fullstack and mobile software engineer crafting resilient backends and
                  cross-platform applications with Python, Django, Node.js, and Flutter.
                </p>
              </div>

              <div className="pt-10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
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

                <div className="flex items-center gap-2">
                  <a
                    href={SOCIAL_LINKS.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="magnetic-el h-10 w-10 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="magnetic-el h-10 w-10 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.twitter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="magnetic-el h-10 w-10 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.email.url}
                    aria-label="Email"
                    className="magnetic-el h-10 w-10 rounded-full flex items-center justify-center bg-surface-elevated hover:bg-brand-fill text-content-primary hover:text-brand-onPrimary border border-brand-border hover:border-brand-fill transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Interactive 3D Prism Stage with Volumetric Monochrome Rim Backlight */}
            <div className="hero-cell lg:col-span-5 p-4 flex items-center justify-center relative bg-surface-elevated min-h-[360px] sm:min-h-[440px] overflow-hidden">
              {/* Subtle Monochrome Volumetric Rim Halo Behind the 3D Sculpture */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute w-72 h-72 rounded-full blur-2xl"
                style={{
                  background: isDark
                    ? 'radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 45%, transparent 72%)'
                    : 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.03) 45%, transparent 72%)',
                }}
              />
              <div
                ref={canvasMountRef}
                className="relative z-10 w-full h-[360px] sm:h-[420px] cursor-pointer"
                title="Click to pulse 3D prism"
                aria-label="Interactive 3D prism sculpture"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
