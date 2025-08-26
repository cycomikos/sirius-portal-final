import { useEffect, useRef, useState } from 'react';
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
    { value: '500+', label: t.wellsMonitored },
    { value: '45%', label: t.efficiencyGain },
    { value: '24/7', label: t.operations247 },
    { value: '15+', label: t.globalMarkets }
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
      // Securely load Three.js with integrity verification and fallback
      const loadThreeJS = () => {
        const script = document.createElement('script');
        
        // Primary CDN - cdnjs.cloudflare.com with SRI
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.integrity = 'sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==';
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.defer = true;
        
        // Add CSP nonce if available (for enhanced security)
        const cspNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
        if (cspNonce) {
          script.nonce = cspNonce;
        }
        
        script.onload = () => {
          // Verify Three.js loaded correctly
          if (typeof (window as any).THREE !== 'undefined') {
            initGlobe();
          } else {
            console.warn('Three.js loaded but not available on window object');
            fallbackToCanvas();
          }
        };
        
        script.onerror = (error) => {
          console.warn('Failed to load Three.js from primary CDN, attempting fallback:', error);
          tryFallbackCDN();
        };
        
        // Security: Set referrer policy
        script.referrerPolicy = 'no-referrer';
        
        document.head.appendChild(script);
      };
      
      // Fallback CDN loader
      const tryFallbackCDN = () => {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js';
        fallbackScript.crossOrigin = 'anonymous';
        fallbackScript.async = true;
        fallbackScript.defer = true;
        fallbackScript.referrerPolicy = 'no-referrer';
        
        fallbackScript.onload = () => {
          if (typeof (window as any).THREE !== 'undefined') {
            console.info('Three.js loaded from fallback CDN');
            initGlobe();
          } else {
            console.warn('Three.js fallback CDN failed, using canvas fallback');
            fallbackToCanvas();
          }
        };
        
        fallbackScript.onerror = () => {
          console.warn('All Three.js CDN sources failed, using canvas fallback');
          fallbackToCanvas();
        };
        
        document.head.appendChild(fallbackScript);
      };
      
      // Canvas 2D fallback with enhanced security
      const fallbackToCanvas = () => {
        const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Create a more secure image loading process
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        
        img.onload = () => {
          try {
            // Validate image dimensions for security
            if (img.width > 0 && img.height > 0 && img.width <= 2000 && img.height <= 2000) {
              ctx.drawImage(img, 0, 0, 400, 400);
              
              // Add a subtle overlay to indicate fallback mode
              ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
              ctx.fillRect(0, 0, 400, 400);
              ctx.fillStyle = 'white';
              ctx.font = '16px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Static View', 200, 200);
            }
          } catch (error) {
            console.warn('Canvas drawing failed:', error);
            // Final fallback - just draw a placeholder
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = '#4a9eff';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🌍', 200, 200);
          }
        };
        
        img.onerror = () => {
          console.warn('Image loading failed, drawing placeholder');
          // Final fallback - simple graphic
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 0, 400, 400);
          ctx.fillStyle = '#4a9eff';
          ctx.font = '64px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('🌍', 200, 200);
        };
        
        // Use a more secure image source with size constraints
        img.src = 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop&crop=center&auto=format&q=75';
      };
      
      // Start the loading process
      loadThreeJS();
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
              {t.technologyStackTitle}
            </h2>
            <p className="about-description">
              {t.techStack}
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
              <h3 className="metrics-title">{t.operationalMetricsTitle}</h3>
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