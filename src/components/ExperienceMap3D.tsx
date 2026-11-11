import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../utils/theme';

gsap.registerPlugin(ScrollTrigger);

export interface ExperienceMilestone {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  lat: number;
  lon: number;
}

const EXPERIENCE_MILESTONES: ExperienceMilestone[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Meghee LLC.',
    period: '2024 - Present',
    description:
      'Mentored and guided junior developers on mobile development best practices, state management principles, and API integration, resulting in improved team productivity and high-quality codebases. Developed file-handling features for backend systems, including secure file uploads, voice file processing, and dependency resolution to ensure seamless integration and conflict-free operations. Optimized backend services for network efficiency by introducing caching mechanisms, implementing efficient data retrieval strategies, and managing pagination for large datasets, leading to reduced response times and improved system scalability.',
    lat: 26,
    lon: 12,
  },
  {
    id: 2,
    title: 'Founding Backend Developer',
    company: 'Blucera Inc',
    period: '2022 - 2024',
    description:
      'Designed and implemented a robust, scalable backend using Django, backed by PostgreSQL for relational data and Redis for caching and task queuing. Leveraged Apache Kafka to build an asynchronous, event-driven system enabling seamless communication across various microservices. Integrated secure and modular payment services supporting multiple gateways and transaction workflows. Developed APIs and data models for a flexible B2B/B2C marketplace supporting listings, transactions, and user engagement. Engineered backend logic for file-based data processing and valuation algorithms. Built features to support small business operations, including scheduling, analytics, and learning management systems. Contributed to CI/CD pipelines, containerization (Docker), and monitoring, ensuring high availability and low latency across services.',
    lat: 16,
    lon: 102,
  },
  {
    id: 3,
    title: 'Lead Mobile Developer',
    company: 'Dora',
    period: '2024 - 2024 contract',
    description:
      'Developed and maintained the company’s primary mobile application using Flutter, delivering a consistent experience on both Android and iOS. Implemented features allowing riders to view and accept parcel pickup tasks, update statuses, and manage daily delivery workflows. Integrated GPS and location services to enable real-time rider tracking during delivery, enhancing transparency and reliability for users. Built secure delivery confirmation flows, including one-time PIN verification, digital signatures, and delivery photo capture. Applied effective state management solutions (e.g., Provider, Riverpod, or Bloc depending on actual use) to ensure a responsive and stable app experience. Contributed to release cycles through rigorous testing, bug fixes, and performance tuning to maintain high app quality.',
    lat: -18,
    lon: 192,
  },
  {
    id: 4,
    title: 'Lead Mobile Developer',
    company: 'KaboCash',
    period: '2023 - 2024 contract',
    description:
      'Cross-Platform App Development: Built and maintained a high-performance, user-friendly mobile application using Flutter, enabling seamless money transfers across multiple African regions. Designed intuitive user interfaces for sending and receiving money, viewing transaction histories, and managing recipient contacts. Helped abstract currency conversion complexities, providing users with a local-feel experience regardless of where they send funds. Integrated secure authentication and transaction verification methods (e.g., OTP, biometrics) to protect user data and financial operations. Implemented push notifications and real-time updates to keep users informed of transaction statuses. Worked closely with product and backend teams to ensure accurate API integration and smooth release cycles.',
    lat: 20,
    lon: 282,
  },
];

const GLOBE_RADIUS = 1.95;

function latLonToVector3(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);
  const x = radius * Math.cos(lat) * Math.sin(lon);
  const y = radius * Math.sin(lat);
  const z = radius * Math.cos(lat) * Math.cos(lon);
  return new THREE.Vector3(x, y, z);
}

const ExperienceMap3D: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const detailContentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const globePivotRef = useRef<THREE.Group | null>(null);
  const beaconGroupsRef = useRef<THREE.Group[]>([]);

  const flyToMilestone = useCallback((index: number) => {
    setActiveIndex(index);
    activeIndexRef.current = index;

    if (detailContentRef.current) {
      gsap.fromTo(
        detailContentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out', overwrite: true }
      );
    }

    const milestone = EXPERIENCE_MILESTONES[index];
    const pivot = globePivotRef.current;
    if (pivot && milestone) {
      const targetRotY = -THREE.MathUtils.degToRad(milestone.lon);
      const targetRotX = THREE.MathUtils.degToRad(milestone.lat * 0.65);

      let deltaY = ((targetRotY - pivot.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
      if (deltaY < -Math.PI) deltaY += Math.PI * 2;

      gsap.to(pivot.rotation, {
        y: pivot.rotation.y + deltaY,
        x: targetRotX,
        duration: 1.05,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    beaconGroupsRef.current.forEach((group, idx) => {
      const isSelected = idx === index;
      gsap.to(group.scale, {
        x: isSelected ? 1.38 : 1,
        y: isSelected ? 1.38 : 1,
        z: isSelected ? 1.38 : 1,
        duration: 0.45,
        ease: 'back.out(1.7)',
      });
    });
  }, []);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const isDark = resolvedTheme === 'dark';

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 430;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 6.9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.25 : 1.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.2 : 1.6);
    dirLight.position.set(6, 8, 7);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0xa78bfa : 0x7c3aed, 1.8);
    rimLight.position.set(-6, -5, 4);
    scene.add(rimLight);

    const globePivot = new THREE.Group();
    scene.add(globePivot);
    globePivotRef.current = globePivot;

    const primaryColor = isDark ? 0xa78bfa : 0x6d28d9;
    const containerColor = isDark ? 0x6d28d9 : 0xddd6fe;
    const globeSurfaceColor = isDark ? 0x0d0d12 : 0xf4f4f7;
    const gridWireColor = isDark ? 0x8b5cf6 : 0x6d28d9;

    // 1. Core Globe Sphere
    const sphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: globeSurfaceColor,
      roughness: 0.68,
      metalness: 0.18,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globePivot.add(globeMesh);

    // 2. Geodesic Wireframe Shell
    const wireGeo = new THREE.IcosahedronGeometry(GLOBE_RADIUS + 0.015, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: gridWireColor,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.44 : 0.34,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globePivot.add(wireMesh);

    // 3. Spherical Surface Dot Constellation on Globe
    const dotCount = 200;
    const dotPositions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = GLOBE_RADIUS + 0.03;
      dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const surfaceDotsGeo = new THREE.BufferGeometry();
    surfaceDotsGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const surfaceDotsMat = new THREE.PointsMaterial({
      color: isDark ? 0xc4b5fd : 0x5b21b6,
      size: 0.045,
      transparent: true,
      opacity: isDark ? 0.72 : 0.5,
    });
    const surfaceDots = new THREE.Points(surfaceDotsGeo, surfaceDotsMat);
    globePivot.add(surfaceDots);

    // 4. Outer Equatorial & Polar Orbital Rings
    const orbitRingGeo = new THREE.TorusGeometry(GLOBE_RADIUS + 0.55, 0.022, 16, 128);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
    });
    const orbitRing1 = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing1.rotation.x = Math.PI / 2.3;
    orbitRing1.rotation.y = 0.3;
    scene.add(orbitRing1);

    const orbitRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(GLOBE_RADIUS + 0.82, 0.015, 16, 128),
      orbitRingMat
    );
    orbitRing2.rotation.x = -Math.PI / 3;
    orbitRing2.rotation.z = 0.4;
    scene.add(orbitRing2);

    // 5. Radial 3D Beacons on the Globe Surface
    const beaconGroups: THREE.Group[] = [];
    const pulseRings: THREE.Mesh[] = [];
    const hitTargets: THREE.Object3D[] = [];

    EXPERIENCE_MILESTONES.forEach((milestone, idx) => {
      const surfacePos = latLonToVector3(milestone.lat, milestone.lon, GLOBE_RADIUS);
      const normal = surfacePos.clone().normalize();

      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(surfacePos);
      beaconGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      beaconGroup.userData = { milestoneIndex: idx };

      const padGeo = new THREE.CylinderGeometry(0.19, 0.23, 0.09, 32);
      const padMat = new THREE.MeshStandardMaterial({
        color: containerColor,
        roughness: 0.3,
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.y = 0.045;
      pad.userData = { milestoneIndex: idx };
      beaconGroup.add(pad);

      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 16);
      const stemMat = new THREE.MeshBasicMaterial({ color: primaryColor });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.3;
      beaconGroup.add(stem);

      const headGeo = new THREE.OctahedronGeometry(0.22, 0);
      const headMat = new THREE.MeshStandardMaterial({
        color: primaryColor,
        emissive: isDark ? 0x7c3aed : 0x4c1d95,
        emissiveIntensity: isDark ? 0.65 : 0.25,
        roughness: 0.2,
        metalness: 0.2,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.65;
      head.name = 'head';
      head.userData = { milestoneIndex: idx };
      beaconGroup.add(head);
      hitTargets.push(head, pad);

      const ringGeo = new THREE.RingGeometry(0.22, 0.34, 36);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const pulseRing = new THREE.Mesh(ringGeo, ringMat);
      pulseRing.position.y = 0.03;
      beaconGroup.add(pulseRing);
      pulseRings.push(pulseRing);

      globePivot.add(beaconGroup);
      beaconGroups.push(beaconGroup);
    });

    // 6. 3D Great-Circle Flight Arcs Connecting Beacons Around the Globe
    const travelerDots: { mesh: THREE.Mesh; curve: THREE.CubicBezierCurve3; offset: number }[] = [];

    for (let i = 0; i < EXPERIENCE_MILESTONES.length; i++) {
      const m1 = EXPERIENCE_MILESTONES[i];
      const m2 = EXPERIENCE_MILESTONES[(i + 1) % EXPERIENCE_MILESTONES.length];

      const start = latLonToVector3(m1.lat, m1.lon, GLOBE_RADIUS + 0.58);
      const end = latLonToVector3(m2.lat, m2.lon, GLOBE_RADIUS + 0.58);

      const ctrl1 = start.clone().lerp(end, 0.33).normalize().multiplyScalar(GLOBE_RADIUS + 1.15);
      const ctrl2 = start.clone().lerp(end, 0.66).normalize().multiplyScalar(GLOBE_RADIUS + 1.15);

      const curve = new THREE.CubicBezierCurve3(start, ctrl1, ctrl2, end);
      const tubeGeo = new THREE.TubeGeometry(curve, 44, 0.024, 10, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: isDark ? 0.68 : 0.52,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      globePivot.add(tubeMesh);

      const dotGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0xffffff : 0x4c1d95,
      });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      globePivot.add(dotMesh);
      travelerDots.push({ mesh: dotMesh, offset: i * 0.25, curve });
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragDist = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      dragDist = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && globePivotRef.current) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        dragDist += Math.abs(dx) + Math.abs(dy);
        globePivotRef.current.rotation.y += dx * 0.007;
        globePivotRef.current.rotation.x = THREE.MathUtils.clamp(
          globePivotRef.current.rotation.x + dy * 0.005,
          -0.8,
          0.8
        );
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onPointerUp = () => {
      if (isDragging && dragDist < 8) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(hitTargets, false);
        if (hits.length > 0) {
          const idx = hits[0].object.userData?.milestoneIndex;
          if (typeof idx === 'number') {
            flyToMilestone(idx);
          }
        }
      }
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 430;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    beaconGroupsRef.current = beaconGroups;

    const initialMilestone = EXPERIENCE_MILESTONES[activeIndexRef.current];
    if (initialMilestone) {
      globePivot.rotation.y = -THREE.MathUtils.degToRad(initialMilestone.lon);
      globePivot.rotation.x = THREE.MathUtils.degToRad(initialMilestone.lat * 0.65);
    }
    beaconGroups.forEach((g, idx) => {
      const s = idx === activeIndexRef.current ? 1.38 : 1;
      g.scale.set(s, s, s);
    });

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!isDragging) {
        globePivot.rotation.y += 0.0022;
      }

      orbitRing1.rotation.z = t * 0.22;
      orbitRing2.rotation.y = -t * 0.18;

      beaconGroups.forEach((group, idx) => {
        const head = group.getObjectByName('head');
        if (head) {
          head.rotation.y = t * 1.8 + idx;
          head.position.y = 0.65 + Math.sin(t * 2.5 + idx) * 0.06;
        }
      });

      pulseRings.forEach((ring, idx) => {
        const phase = (t * 0.9 + idx * 0.3) % 1;
        const scale = 1 + phase * 1.9;
        ring.scale.set(scale, scale, 1);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - phase) * (idx === activeIndexRef.current ? 0.95 : 0.45);
      });

      travelerDots.forEach((td) => {
        const progress = (t * 0.24 + td.offset) % 1;
        const pos = td.curve.getPointAt(progress);
        td.mesh.position.copy(pos);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [resolvedTheme, flyToMilestone]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exp-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.75,
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

  const currentMilestone = EXPERIENCE_MILESTONES[activeIndex];

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + EXPERIENCE_MILESTONES.length) % EXPERIENCE_MILESTONES.length;
    flyToMilestone(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % EXPERIENCE_MILESTONES.length;
    flyToMilestone(nextIdx);
  };

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(124, 58, 237, 0.14), transparent 65%)`;
    spotlightRef.current.style.opacity = '1';
  };

  return (
    <section id="experience" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-8 exp-reveal flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-[-0.04em] text-content-primary">
          Experience
        </h2>

        {/* Google M3 Pill Company Selector Tabs */}
        <div
          className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-full bg-surface-elevated border border-brand-border"
          role="tablist"
          aria-label="Work experience"
        >
          {EXPERIENCE_MILESTONES.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => flyToMilestone(idx)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-700 bg-brand-fill text-white shadow-sm'
                    : 'text-content-secondary hover:text-content-primary hover:bg-surface-muted'
                }`}
              >
                {item.company}
              </button>
            );
          })}
        </div>
      </div>

      {/* Google M3 Split Grid */}
      <div
        onMouseMove={handleSectionMouseMove}
        onMouseLeave={() => {
          if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
        }}
        className="exp-reveal relative border border-brand-border bg-surface-card rounded-[28px] overflow-hidden shadow-xl"
      >
        <span className="geist-crosshair top-3 left-3" />
        <span className="geist-crosshair top-3 right-3" />
        <span className="geist-crosshair bottom-3 left-3" />
        <span className="geist-crosshair bottom-3 right-3" />

        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-0"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-brand-border">
          {/* Left: Interactive 3D Globe */}
          <div className="lg:col-span-6 relative min-h-[390px] sm:min-h-[460px] flex items-center justify-center bg-surface-elevated overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute w-72 h-72 rounded-full blur-3xl opacity-15"
              style={{
                background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
              }}
            />
            <div
              ref={canvasContainerRef}
              className="relative z-10 w-full h-[390px] sm:h-[460px] cursor-grab active:cursor-grabbing"
              aria-label="3D work experience globe"
            />

            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="h-10 w-10 rounded-full flex items-center justify-center bg-surface-card hover:bg-brand-fill text-content-primary hover:text-white border border-brand-border hover:border-brand-fill transition-colors"
                aria-label="Previous experience"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="h-10 w-10 rounded-full flex items-center justify-center bg-purple-700 bg-brand-fill text-white hover:brightness-110 transition-all"
                aria-label="Next experience"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Experience Detail Cell */}
          <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
            <div ref={detailContentRef} className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-brand-container text-brand-onContainer border border-brand-border font-mono text-xs font-semibold">
                  {currentMilestone.company}
                </span>
                <span className="text-xs font-mono font-medium text-content-secondary">
                  {currentMilestone.period}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-[-0.03em] text-content-primary">
                {currentMilestone.title}
              </h3>

              <p className="text-base sm:text-lg text-content-secondary leading-relaxed">
                {currentMilestone.description}
              </p>
            </div>

            <div className="pt-8 flex items-center gap-2">
              {EXPERIENCE_MILESTONES.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => flyToMilestone(idx)}
                  aria-label={`Select ${item.company}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'w-10 bg-purple-700 bg-brand-fill'
                      : 'w-2.5 bg-brand-border hover:bg-brand-borderStrong'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceMap3D;
