import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Section } from '../UI';
import './AboutSection.css';

export function AboutSection() {
  const { t } = useLanguage();
  const earthRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const techStack = [
    'ArcGIS Enterprise',
    'ArcGIS Experience Builder', 
    'ArcGIS Pro',
    'Microsoft Azure AD (Active Directory)',
    'Microsoft Power BI'
  ];

  const techBadges = [
    'Microsoft Power BI',
    'ArcGIS Enterprise',
    'ArcGIS Experience Builder',
    'ArcGIS Pro',
    'Microsoft Azure AD',
    'Active Directory'
  ];

  const performanceMetrics = [
    { value: '500+', label: 'Wells Monitored' },
    { value: '45%', label: 'Efficiency Gain' },
    { value: '24/7', label: 'Operations' },
    { value: '15+', label: 'Global Markets' }
  ];

  // Enhanced theme management with proper detection
  useEffect(() => {
    const detectAndApplyTheme = () => {
      // Check for explicit theme attribute
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      const explicitTheme = htmlElement.getAttribute('data-theme') || 
                           bodyElement.getAttribute('data-theme') ||
                           htmlElement.className.match(/theme-(\w+)/)?.[1];
      
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Determine final theme
      let finalTheme = 'light';
      if (explicitTheme === 'dark' || (!explicitTheme && prefersDark)) {
        finalTheme = 'dark';
      }
      
      setIsDarkMode(finalTheme === 'dark');
      
      // Apply theme to section immediately
      const aboutSection = document.querySelector('.about-section');
      if (aboutSection) {
        aboutSection.setAttribute('data-theme', finalTheme);
      }
    };

    // Initial detection
    detectAndApplyTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      detectAndApplyTheme();
    };
    
    // Listen for manual theme changes
    const observer = new MutationObserver(() => {
      detectAndApplyTheme();
    });
    
    // Observe both html and body for theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  // Enhanced interaction effects with 3D globe
  useEffect(() => {
    let animationFrame: number;
    let globeScene: any = null;

    // Initialize 3D Globe
    const initGlobe = async () => {
      const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      try {
        // Create 3D Globe using Three.js
        const scene = new (window as any).THREE.Scene();
        const camera = new (window as any).THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new (window as any).THREE.WebGLRenderer({ 
          canvas: canvas, 
          antialias: true, 
          alpha: true 
        });
        
        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0);

        // Create Earth geometry and materials
        const geometry = new (window as any).THREE.SphereGeometry(1.8, 64, 64);
        
        // Load Earth texture
        const textureLoader = new (window as any).THREE.TextureLoader();
        const earthTexture = textureLoader.load('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1024&h=512&fit=crop');
        
        const material = new (window as any).THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 100,
          transparent: true
        });

        const earth = new (window as any).THREE.Mesh(geometry, material);
        scene.add(earth);

        // Add atmospheric glow
        const atmosphereGeometry = new (window as any).THREE.SphereGeometry(1.9, 64, 64);
        const atmosphereMaterial = new (window as any).THREE.ShaderMaterial({
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(0.1, 0.6, 1.0, 0.5) * intensity;
            }
          `,
          blending: (window as any).THREE.AdditiveBlending,
          side: (window as any).THREE.BackSide,
          transparent: true
        });

        const atmosphere = new (window as any).THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);

        // Add PETRONAS operation markers
        const addOperationMarker = (lat: number, lng: number, color: string) => {
          const phi = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          
          const x = 1.85 * Math.sin(phi) * Math.cos(theta);
          const y = 1.85 * Math.cos(phi);
          const z = 1.85 * Math.sin(phi) * Math.sin(theta);
          
          const markerGeometry = new (window as any).THREE.SphereGeometry(0.02, 8, 8);
          const markerMaterial = new (window as any).THREE.MeshBasicMaterial({ color: color });
          const marker = new (window as any).THREE.Mesh(markerGeometry, markerMaterial);
          marker.position.set(x, y, z);
          scene.add(marker);

          // Add glow effect
          const glowGeometry = new (window as any).THREE.SphereGeometry(0.04, 8, 8);
          const glowMaterial = new (window as any).THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
          });
          const glow = new (window as any).THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.set(x, y, z);
          scene.add(glow);
        };

        // PETRONAS key locations
        addOperationMarker(3.1390, 101.6869, '#22d3ee');  // Kuala Lumpur HQ
        addOperationMarker(4.9006, 114.9428, '#10b981');  // Brunei Operations
        addOperationMarker(1.3521, 103.8198, '#3b82f6');  // Singapore
        addOperationMarker(-6.2088, 106.8456, '#a855f7'); // Jakarta
        addOperationMarker(25.2048, 55.2708, '#f59e0b');  // Dubai
        addOperationMarker(29.3117, 47.4818, '#ef4444');  // Kuwait
        addOperationMarker(51.5074, -0.1278, '#8b5cf6');  // London
        addOperationMarker(29.7604, -95.3698, '#06b6d4'); // Houston

        // Lighting
        const ambientLight = new (window as any).THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new (window as any).THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        camera.position.z = 4;

        globeScene = { scene, camera, renderer, earth, atmosphere };

        // Animation loop
        const animate = () => {
          animationFrame = requestAnimationFrame(animate);
          
          if (globeScene) {
            // Rotate Earth
            globeScene.earth.rotation.y += 0.003;
            globeScene.atmosphere.rotation.y += 0.002;
            
            globeScene.renderer.render(globeScene.scene, globeScene.camera);
          }
        };
        animate();

      } catch (error) {
        console.warn('3D Globe initialization failed, falling back to 2D image');
        // Fallback to static image
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 400, 400);
          };
          img.src = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop&crop=center';
        }
      }
    };

    // Check if Three.js is available
    if (typeof window !== 'undefined' && (window as any).THREE) {
      initGlobe();
    } else {
      // Dynamically load Three.js
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => initGlobe();
      script.onerror = () => {
        // Fallback to canvas 2D
        const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.drawImage(img, 0, 0, 400, 400);
            };
            img.src = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop&crop=center';
          }
        }
      };
      document.head.appendChild(script);
    }

    // Subtle mouse interaction for tech badges only
    const handleMouseMove = (e: MouseEvent) => {
      const badges = document.querySelectorAll('.tech-badge');
      const earth = earthRef.current;
      
      if (earth) {
        const rect = earth.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Only apply subtle movement to tech badges, not the globe
        badges.forEach((badge, index) => {
          const element = badge as HTMLElement;
          const intensity = 0.008 + (index * 0.002); // Reduced intensity
          const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
          
          // Only apply effect when mouse is reasonably close to the globe
          if (distance < 300) {
            const x = mouseX * intensity;
            const y = mouseY * intensity;
            element.style.transform = `translate(${x}px, ${y}px)`;
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <Section 
      id="about" 
      className="about-section" 
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <div className="about-container">
        {/* Executive Header */}
        <header className="about-header">
          <p className="about-subtitle">
            SMARTER OPERATIONS WITH GEOSPATIAL INSIGHT
          </p>
          <h1 className="about-title">
            Sirius: PETRONAS' New <span className="highlight">GIS-Powered Platform</span>
          </h1>
          <p className="about-description">
            <strong>Sirius</strong> represents PETRONAS' commitment to digital transformation, 
            providing comprehensive geospatial intelligence that empowers decision-makers across 
            our global operations with unprecedented visibility into geological, geophysical, 
            and asset management data.
          </p>
          <p className="about-description">
            Built on enterprise-grade architecture, Sirius integrates industry-leading 
            technologies to deliver mission-critical insights that drive operational excellence 
            and strategic growth across our upstream portfolio.
          </p>

          {/* Executive Insight */}
          <div className="executive-insight">
            <p className="insight-content">
              "Sirius has fundamentally transformed our approach to field development and 
              asset optimization. The platform's integrated geospatial capabilities have 
              enabled our teams to reduce decision-making cycles by 60% while improving 
              operational accuracy across all our major projects."
            </p>
            <div className="insight-attribution">
              <div className="attribution-avatar">DM</div>
              <div className="attribution-details">
                <h4>Dato' Mohammad Zainal</h4>
                <p>Executive Vice President, Upstream</p>
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
                  id="globe-canvas"
                  width="400"
                  height="400"
                  className="earth-image"
                  aria-label="Interactive 3D globe showing PETRONAS global operations"
                ></canvas>
              </div>
              
              <div className="sirius-logo" role="button" tabIndex={0} aria-label="SIRIUS Platform">
                SIRIUS
              </div>
              
              <div className="tech-badges" role="region" aria-label="Technology ecosystem">
                {techBadges.map((badge, index) => (
                  <div 
                    key={index} 
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
          
          {/* Enterprise Features */}
          <div className="about-features">
            <h2 className="features-title">
              Enterprise Technology Stack
            </h2>
            <p className="about-description">
              Sirius leverages best-in-class enterprise platforms to deliver 
              unparalleled geospatial intelligence and operational insights.
            </p>
            
            <ul className="tech-stack-list" role="list">
              {techStack.map((tech, index) => (
                <li 
                  key={index} 
                  className="tech-stack-item"
                  tabIndex={0}
                  role="listitem"
                >
                  <div className="tech-icon" aria-hidden="true"></div>
                  <span className="tech-name">{tech}</span>
                </li>
              ))}
            </ul>
            
            {/* Performance Metrics Dashboard */}
            <div className="performance-metrics">
              <h3 className="metrics-title">Operational Excellence Metrics</h3>
              <div className="metrics-grid">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="metric-card">
                    <span className="metric-value" aria-label={`${metric.value} ${metric.label}`}>
                      {metric.value}
                    </span>
                    <div className="metric-label">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}