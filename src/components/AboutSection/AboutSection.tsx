import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Section } from '../UI';
import { createSecureScript, isAllowedDomain } from '../../utils/security';
import './AboutSection.css';

// Move static data outside component to prevent recreation
const TECH_STACK = [
  'Microsoft Azure Cloud Infrastructure',
  'ArcGIS Enterprise & Experience Builder', 
  'Advanced AI & Machine Learning Models',
  'Real-time Data Processing & Analytics',
  'Enterprise Security & Compliance Framework'
];

const TECH_BADGES = [
  'Azure AI & ML',
  'ArcGIS Enterprise',
  'Microsoft Power BI',
  'Azure IoT Hub',
  'Real-time Analytics',
  'Blockchain Security'
];

// DEBUG: Check if array length is being logged somewhere
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Temporarily log to identify if this is the source
  // console.log('TECH_BADGES length:', TECH_BADGES.length); // This would log "6"
}

// Global Three.js management to prevent multiple instances
let isThreeJSLoading = false;
let isThreeJSLoaded = false;
let threeJSPromise: Promise<void> | null = null;

const loadThreeJS = (): Promise<void> => {
  if (isThreeJSLoaded && (window as any).THREE) {
    return Promise.resolve();
  }
  
  if (threeJSPromise) {
    return threeJSPromise;
  }
  
  if (isThreeJSLoading) {
    return new Promise((resolve) => {
      const checkLoaded = () => {
        if (isThreeJSLoaded) {
          resolve();
        } else {
          setTimeout(checkLoaded, 50);
        }
      };
      checkLoaded();
    });
  }
  
  isThreeJSLoading = true;
  
  threeJSPromise = new Promise((resolve, reject) => {
    if ((window as any).THREE) {
      isThreeJSLoaded = true;
      isThreeJSLoading = false;
      resolve();
      return;
    }
    
    // Use secure script creation with CSP compliance
    const threeJSUrl = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    const script = createSecureScript(threeJSUrl, {
      integrity: 'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==', // Three.js r128 integrity hash
      crossOrigin: 'anonymous',
      referrerPolicy: 'no-referrer'
      // Note: Nonce not required in development due to unsafe-inline CSP
    });
    
    if (!script) {
      isThreeJSLoading = false;
      reject(new Error('Failed to create secure Three.js script'));
      return;
    }
    
    script.onload = () => {
      if ((window as any).THREE) {
        isThreeJSLoaded = true;
        isThreeJSLoading = false;
        resolve();
      } else {
        isThreeJSLoading = false;
        reject(new Error('Three.js failed to initialize'));
      }
    };
    
    script.onerror = () => {
      isThreeJSLoading = false;
      reject(new Error('Failed to load Three.js'));
    };
    
    document.head.appendChild(script);
  });
  
  return threeJSPromise;
};

export const AboutSection = memo(function AboutSection() {
  const { t } = useLanguage();
  const earthRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const globeSceneRef = useRef<any>(null);
  const isVisibleRef = useRef<boolean>(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout>();

  // Memoize performance metrics to prevent recreation
  const performanceMetrics = useMemo(() => [
    { value: '2,500+', label: t.wellsMonitored },
    { value: '$2.3B', label: t.efficiencyGain },
    { value: '24/7', label: t.operations247 },
    { value: '25+', label: t.globalMarkets }
  ], [t.wellsMonitored, t.efficiencyGain, t.operations247, t.globalMarkets]);


  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (mouseTimeoutRef.current) {
      clearTimeout(mouseTimeoutRef.current);
    }
    
    mouseTimeoutRef.current = setTimeout(() => {
      const badges = document.querySelectorAll('.tech-badge');
      const earth = earthRef.current;
      
      if (earth && badges.length > 0) {
        // DEBUG: Check if this is the source of the "6" console log
        // console.log('DEBUG: badges.length =', badges.length);
        const rect = earth.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        
        if (distance < 300) {
          badges.forEach((badge, index) => {
            const element = badge as HTMLElement;
            const intensity = 0.005 + (index * 0.001); // Further reduced
            const x = mouseX * intensity;
            const y = mouseY * intensity;
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`; // Use transform3d
          });
        }
      }
    }, 16); // Throttle to ~60fps
  }, []);


  // Optimized 3D globe with proper cleanup and performance improvements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Intersection Observer for visibility-based animation
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    intersectionObserver.observe(canvas);

    const initGlobe = async () => {
      try {
        await loadThreeJS();
        
        if (!isVisibleRef.current || !canvas) return;

        const THREE = (window as any).THREE;
        
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
          canvas,
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: "high-performance"
        });
        
        renderer.setSize(320, 320); // Match actual display size
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio

        // Optimized geometry - reduced complexity
        const earthGeometry = new THREE.SphereGeometry(1.8, 32, 32); // Reduced from 64x64
        
        // Load texture with CSP-compliant URL validation
        const textureUrl = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=512&h=256&fit=crop';
        
        if (!isAllowedDomain(textureUrl)) {
          console.warn('Texture URL not in allowed domains, using fallback');
          renderFallback();
          return;
        }
        
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        
        const earthTexture = textureLoader.load(
          textureUrl,
          undefined,
          undefined,
          (error: unknown) => {
            console.warn('Failed to load earth texture, using fallback:', error);
            renderFallback();
          }
        );
        
        const earthMaterial = new THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 50, // Reduced for performance
          transparent: false // Disable transparency for performance
        });

        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);

        // Simplified atmosphere without custom shaders to avoid WebGL errors
        const atmosphereGeometry = new THREE.SphereGeometry(1.9, 24, 24); // Even more reduced
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: 0x4a9eff,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Optimized markers using instanced rendering
        const markerGeometry = new THREE.SphereGeometry(0.02, 6, 6); // Reduced complexity
        const locations = [
          { lat: 3.1390, lng: 101.6869, color: '#22d3ee' },
          { lat: 4.9006, lng: 114.9428, color: '#10b981' },
          { lat: 1.3521, lng: 103.8198, color: '#3b82f6' },
          { lat: -6.2088, lng: 106.8456, color: '#a855f7' },
          { lat: 25.2048, lng: 55.2708, color: '#f59e0b' },
          { lat: 29.3117, lng: 47.4818, color: '#ef4444' },
          { lat: 51.5074, lng: -0.1278, color: '#8b5cf6' },
          { lat: 29.7604, lng: -95.3698, color: '#06b6d4' }
        ];

        locations.forEach(({ lat, lng, color }) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          
          const x = 1.85 * Math.sin(phi) * Math.cos(theta);
          const y = 1.85 * Math.cos(phi);
          const z = 1.85 * Math.sin(phi) * Math.sin(theta);
          
          const markerMaterial = new THREE.MeshBasicMaterial({ color });
          const marker = new THREE.Mesh(markerGeometry, markerMaterial);
          marker.position.set(x, y, z);
          scene.add(marker);
        });

        // Simplified lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        camera.position.z = 4;

        globeSceneRef.current = { scene, camera, renderer, earth, atmosphere };

        // Optimized animation loop with visibility check
        const animate = () => {
          animationFrameRef.current = requestAnimationFrame(animate);
          
          // Only animate if visible and scene exists
          if (isVisibleRef.current && globeSceneRef.current) {
            const { scene, camera, renderer, earth, atmosphere } = globeSceneRef.current;
            
            // Slower rotation for better performance
            earth.rotation.y += 0.002;
            atmosphere.rotation.y += 0.001;
            
            renderer.render(scene, camera);
          }
        };
        
        animate();

      } catch (error) {
        console.warn('3D Globe initialization failed, using fallback:', error);
        renderFallback();
      }
    };

    const renderFallback = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 320, 320);
      ctx.fillStyle = '#4a9eff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌍', 160, 160);
    };


    // Initialize globe when component becomes visible
    const timeoutId = setTimeout(initGlobe, 100);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Proper Three.js cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (globeSceneRef.current) {
        const { scene, renderer } = globeSceneRef.current;
        
        // Dispose of geometries and materials
        scene.traverse((object: any) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        
        renderer.dispose();
        globeSceneRef.current = null;
      }
    };
  }, []);

  return (
    <Section 
      id="about" 
      className="about-section"
    >
      <div className="about-container">
        {/* Executive Header */}
        <header className="about-header">
          <p className="about-subtitle">
            {t.aboutSubtitle}
          </p>
          <h1 className="about-title">
            {t.aboutTitle.split('GIS-Powered Platform')[0]}
            <span className="highlight">GIS-Powered Platform</span>
          </h1>
          <p className="about-description">
            {t.aboutDescription}
          </p>
          <p className="about-description">
            {t.aboutDescription2}
          </p>

          {/* Executive Insight */}
          <div className="executive-insight">
            <p className="insight-content">
              "{t.executiveInsight}"
            </p>
            <div className="insight-attribution">
              <div className="attribution-avatar">DM</div>
              <div className="attribution-details">
                <h4>{t.executiveName}</h4>
                <p>{t.executiveTitle}</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="about-content">
          {/* Premium 3D Globe */}
          <div className="about-visual">
            <div ref={earthRef} className="earth-container">
              {/* Orbital Rings */}
              <div className="orbital-ring"></div>
              <div className="orbital-ring"></div>
              <div className="orbital-ring"></div>
              
              <div className="globe-container">
                <canvas 
                  ref={canvasRef}
                  width="320"
                  height="320"
                  className="earth-image"
                  aria-label="Interactive 3D globe showing PETRONAS global operations"
                ></canvas>
              </div>
              
              <div className="sirius-logo" role="button" tabIndex={0} aria-label="SIRIUS Platform">
                SIRIUS
              </div>
              
              <div className="tech-badges" role="region" aria-label="Technology ecosystem">
                {TECH_BADGES.map((badge) => (
                  <div 
                    key={badge} 
                    className="tech-badge" 
                    tabIndex={0}
                    role="button"
                    aria-label={`Technology: ${badge}`}
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Enhanced Enterprise Features */}
          <div className="about-features enhanced">
            <h2 className="features-title">
              {t.technologyStackTitle}
            </h2>
            <p className="about-description">
              {t.techStack}
            </p>
            
            <div className="tech-stack-grid" role="list">
              {TECH_STACK.map((tech) => (
                <div 
                  key={tech} 
                  className="tech-stack-card"
                  tabIndex={0}
                  role="listitem"
                >
                  <div className="tech-icon-enhanced" aria-hidden="true">
                    <div className="tech-icon-inner"></div>
                  </div>
                  <div className="tech-content">
                    <h3 className="tech-name">{tech}</h3>
                    <div className="tech-status">
                      <span className="status-indicator active"></span>
                      <span className="status-text">Active</span>
                    </div>
                  </div>
                  <div className="tech-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Full-Width Performance Metrics Dashboard */}
        <div className="performance-metrics full-width">
          <h3 className="metrics-title">{t.operationalMetricsTitle}</h3>
          <div className="metrics-grid">
            {performanceMetrics.map((metric, metricIndex) => (
              <div key={`${metric.value}-${metricIndex}`} className="metric-card">
                <span className="metric-value" aria-label={`${metric.value} ${metric.label}`}>
                  {metric.value}
                </span>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
});