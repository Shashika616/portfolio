"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';
import createGlobe from 'cobe';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { activeTheme } = useGlobalTheme();
  const [mounted, setMounted] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Globe references
  const phi = useRef<number>(0);
  const width = useRef<number>(0);
  const globeInstance = useRef<any>(null);

  const [textRotation, setTextRotation] = useState(0);

  // Memoize static data
  const ORBIT_TEXT = useMemo(() => " • SHASHIKA FERNANDO  • ", []);
  const characters = useMemo(() => ORBIT_TEXT.split(""), [ORBIT_TEXT]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ================= EXIT BOOTSTRAP TERMINAL TYPING ENGINE =================
  useEffect(() => {
    if (!isCalibrating) return;

    const fullString = `W ELCOME TO MY DIGITAL WORKSHOP`;
    let currentIndex = 0;
    setTerminalText(""); 

    const typingInterval = setInterval(() => {
      if (currentIndex < fullString.length) {
        setTerminalText((prev) => prev + fullString.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        const timeoutId = setTimeout(() => {
          onEnter();
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }, 60);

    return () => clearInterval(typingInterval);
  }, [isCalibrating, onEnter]);

  // ================= WEBGL INTERACTIVE MATHEMATICS CORE =================
  useEffect(() => {
    if (!mounted || !globeCanvasRef.current) return;

    const onResize = () => {
      if (globeCanvasRef.current) {
        width.current = globeCanvasRef.current.offsetWidth;
        if (globeInstance.current) {
          globeInstance.current.width = width.current * 2;
          globeInstance.current.height = width.current * 2;
        }
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    if (globeInstance.current) {
      globeInstance.current.destroy();
      globeInstance.current = null;
    }

    const canvas = globeCanvasRef.current;
    
    globeInstance.current = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 2, 2),
      width: width.current * 2,
      height: width.current * 2,
      phi: phi.current,
      theta: 0.25,
      dark: 0,
      diffuse: 0,
      mapSamples: 0,
      mapBrightness: 0,
      baseColor: [0, 0, 0, 0],
      markerColor: [0, 0, 0, 0],
      glowColor: [0, 0, 0, 0],
      markers: [],
      onRender: (state: Record<string, any>) => {
        // Auto-rotate the globe
        phi.current += 0.003;
        state.phi = phi.current;
        
        // Update text rotation to match globe
        setTextRotation(-phi.current * (180 / Math.PI));
      },
    } as any);

    return () => {
      if (globeInstance.current) {
        globeInstance.current.destroy();
        globeInstance.current = null;
      }
      window.removeEventListener('resize', onResize);
    };
  }, [mounted]);

  // ================= BACKGROUND RAINFALL MATRIX ENGINE =================
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = performance.now();
    const frameInterval = 1000 / 30;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const dictionary = [
      "A","B","C","X","Y","Z","0","1","2","5","7","9",
      "/","\\","*","-","+","=","%","$","#","@","!","?"
    ];
    
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops: number[] = Array(columns).fill(1).map(() => 
      Math.floor(Math.random() * (-canvas.height / fontSize))
    );

    const drawMatrix = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(drawMatrix);

      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) return;
      lastFrameTime = currentTime - (deltaTime % frameInterval);

      ctx.fillStyle = 'rgba(248, 250, 252, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      const dropSpeed = isCalibrating ? 1.8 : 0.35;
      const fillColor = activeTheme.fillColor;
      const canvasHeight = canvas.height;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = dictionary[Math.floor(Math.random() * dictionary.length)];
        const xPosition = i * fontSize;
        const yPosition = rainDrops[i] * fontSize;

        if (Math.random() > 0.985) {
          ctx.fillStyle = fillColor + '65';
        } else {
          ctx.fillStyle = fillColor + '18';
        }

        ctx.fillText(text, xPosition, yPosition);

        if (yPosition > canvasHeight && Math.random() > 0.985) {
          rainDrops[i] = 0;
        }
        
        rainDrops[i] += dropSpeed;
      }
    };

    animationFrameId = requestAnimationFrame(drawMatrix);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, activeTheme.fillColor, isCalibrating]);

  // Optimized event handlers
  const handleExploreClick = useCallback(() => {
    setIsCalibrating(true);
  }, []);

  const fadeInUp = useMemo(() => ({
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: "easeOut" as const }
  }), []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes customIdleSpin {
          from { transform: rotateX(65deg) rotateY(-12deg) rotateZ(0deg); }
          to { transform: rotateX(65deg) rotateY(-12deg) rotateZ(360deg); }
        }
        .animate-idle-spin {
          animation: customIdleSpin 24s linear infinite;
        }
        .will-change-transform {
          will-change: transform;
        }
        .will-change-opacity {
          will-change: opacity, filter;
        }
      `}</style>

      <ThemeSelector />

      <div className="w-screen min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden relative select-none selection:bg-slate-200">
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none opacity-[0.7] z-0 mix-blend-multiply"
        />

        <AnimatePresence>
          {isCalibrating && (
            <motion.div
              key="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center font-mono px-6 text-center bg-white/40 backdrop-blur-md"
            >
              <div className="space-y-4 max-w-md p-8 rounded-2xl border border-slate-200/60 bg-white/90 shadow-xl shadow-slate-100/50">
                <div className="flex items-center justify-center gap-3">
                  <span 
                    className="w-2 h-2 rounded-full animate-ping" 
                    style={{ backgroundColor: activeTheme.fillColor }} 
                  />
                  <span className="text-[10px] tracking-[0.25em] font-bold text-slate-400 uppercase">
                    Let's walkthrough my portfolio...
                  </span>
                </div>
                
                <div className="min-h-[28px] px-4">
                  <h2 
                    className="text-base font-bold tracking-wider uppercase font-mono bg-clip-text text-transparent"
                    style={{ 
                      backgroundImage: activeTheme.gradient, 
                      WebkitBackgroundClip: "text", 
                      WebkitTextFillColor: "transparent" 
                    }}
                  >
                    {terminalText}
                    <span 
                      className="animate-pulse font-light ml-0.5 selection:bg-transparent" 
                      style={{ WebkitTextFillColor: 'initial', color: activeTheme.fillColor }}
                    >
                      |
                    </span>
                  </h2>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`theme-content-${activeTheme.name}`}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full min-h-screen relative flex flex-col justify-between z-20 will-change-opacity"
          >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: isCalibrating ? 2.5 : 80, repeat: Infinity, ease: "linear" }}
                className="absolute w-[90vw] h-[90vw] max-w-[1100px] max-h-[1100px] border border-dashed rounded-full opacity-[0.04] will-change-transform"
                style={{ borderColor: activeTheme.fillColor }}
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: isCalibrating ? 1.8 : 50, repeat: Infinity, ease: "linear" }}
                className="absolute w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] border-2 border-dashed rounded-full opacity-[0.03] flex items-center justify-center will-change-transform"
                style={{ borderColor: activeTheme.fillColor }}
              >
                <div className="w-1/2 h-1/2 border border-dotted rounded-full" />
              </motion.div>
              
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0)_40%,#f8fafc_70%)] z-10" />
              
              <div 
                className="absolute top-10 left-10 w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-[0.12]"
                style={{ background: activeTheme.fillColor }}
              />
              <div 
                className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-[0.12]"
                style={{ background: activeTheme.fillColor }}
              />
            </div>

            {/* Stamps */}
            <div className="hidden md:block absolute top-8 left-8 font-mono text-[10px] text-slate-400/80 tracking-widest z-40">
              SYSTEM THEME: {activeTheme.name.toUpperCase()}
            </div>
            <div className="hidden md:block absolute top-8 right-8 font-mono text-[10px] text-slate-400/80 tracking-widest z-40">
              WELCOME!
            </div>

            {/* Hero Body Layout */}
            <motion.div
              animate={isCalibrating ? { opacity: 0, scale: 0.98, filter: "blur(4px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative w-full z-20 grow flex items-center"
            >
              <section className="w-full flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 gap-8 lg:gap-4">
                
                {/* Left Typography Column */}
                <div className="w-full lg:w-3/5 text-center lg:text-left space-y-8 md:space-y-10 order-2 lg:order-1">
                  

                  <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={fadeInUp.viewport}
                    transition={fadeInUp.transition}
                    className="space-y-4"
                  >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900">
                      <span className="block font-sans text-slate-900">Software Engineer</span>
                      <span 
                        className="block bg-clip-text text-transparent transition-all duration-500"
                        style={{
                          backgroundImage: activeTheme.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}
                      >
                        Architecting High-Precision Systems
                      </span>
                    </h1>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
                  >
                    Specializing in cybersecurity, distributed systems, and AI-driven infrastructure. Dedicated to building secure, fault-tolerant mechanics that bridge raw power with luxury refinement.
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                  >
                    <button
                      onClick={handleExploreClick}
                      disabled={isCalibrating}
                      style={{ backgroundImage: activeTheme.gradient }}
                      className="w-full sm:w-auto px-8 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-none cursor-pointer text-base min-h-[48px] flex items-center justify-center font-mono uppercase tracking-wider"
                    >
                      Discover My Work
                    </button>
                    
                    <a
                      href="/cv.pdf"
                      download
                      className="w-full sm:w-auto px-8 py-4 font-bold rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] text-base min-h-[48px] flex items-center justify-center cursor-pointer font-mono uppercase tracking-wider"
                      style={{
                        borderColor: activeTheme.fillColor,
                        color: activeTheme.fillColor,
                        backgroundColor: activeTheme.fillColor + '08'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = activeTheme.fillColor + '15'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = activeTheme.fillColor + '08'; }}
                    >
                      Download CV
                    </a>
                  </motion.div>
                </div>

                {/* Right Column: Dynamic Spin Design */}
                <div className="w-full lg:w-2/5 flex items-center justify-center order-1 lg:order-2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                    className="relative w-[280px] sm:w-[360px] md:w-[400px] aspect-square flex items-center justify-center select-none pointer-events-none"
                  >
                    {/* Perspective Halo Ring - Always spinning */}
                    <div 
                      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center origin-center scale-[1.05] animate-idle-spin will-change-transform"
                      style={{ 
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {characters.map((char, i) => {
                        const angleStep = -360 / characters.length;
                        const rotationAngle = i * angleStep;
                        const isLetter = /[A-Za-z]/.test(char);
                        return (
                          <span
                            key={i}
                            className="absolute font-mono text-sm md:text-base font-black tracking-widest uppercase transition-colors duration-300 will-change-transform"
                            style={{
                              color: activeTheme.fillColor,
                              transform: `rotate(${rotationAngle}deg) translateY(-165px) rotateX(-90deg) ${isLetter ? 'scaleX(-1)' : ''}`,
                              textShadow: `0 0 10px ${activeTheme.fillColor}50`,
                              transformOrigin: 'center center',
                              display: 'inline-block'
                            }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        );
                      })}
                    </div>

                    {/* Canvas - No interaction, just visual */}
                    <canvas
                      key="persistent-invisible-globe-core"
                      ref={globeCanvasRef}
                      className="w-full h-full opacity-0 z-30 pointer-events-none"
                    />
                  </motion.div>
                </div>

              </section>
            </motion.div>

            {/* Footer */}
            <footer className="w-full py-8 px-4 border-t border-slate-100 bg-slate-50 relative z-20">
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                  © {new Date().getFullYear()} Shashika Fernando | ALL RIGHTS RESERVED
                </p>
              </div>
            </footer>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}