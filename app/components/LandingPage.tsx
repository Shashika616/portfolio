"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { activeTheme } = useGlobalTheme();
  const [mounted, setMounted] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ================= EXIT BOOTSTRAP TERMINAL TYPING ENGINE =================
  useEffect(() => {
    if (!isCalibrating) return;

    const fullString = `WELCOME TO MY DIGITAL WORKSHOP`;
    let currentIndex = 0;
    setTerminalText(""); 

    const typingInterval = setInterval(() => {
      if (currentIndex < fullString.length) {
        setTerminalText((prev) => prev + fullString.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          onEnter();
        }, 500); 
      }
    }, 50); 

    return () => clearInterval(typingInterval);
  }, [isCalibrating, activeTheme, onEnter]);

  // ================= BACKGROUND RAINFALL MATRIX ENGINE =================
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = performance.now();
    const frameInterval = 1000 / 24; // 24 FPS Cap

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const dictionary = [
      "A","B","C","X","Y","Z","Ø","α","β","γ","λ","⚙️","🔐","⏱️",
      "0","1","2","5","7","9","[","]","{","}","▲","▼","◆","◇",
      "/","\\","*","-","+","=","%","$","#","@","!","?","&","~"
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

      for (let i = 0; i < rainDrops.length; i++) {
        const text = dictionary[Math.floor(Math.random() * dictionary.length)];
        const xPosition = i * fontSize;
        const yPosition = rainDrops[i] * fontSize;

        ctx.fillStyle = activeTheme.fillColor + '18'; 
        
        if (Math.random() > 0.98) {
          ctx.fillStyle = activeTheme.fillColor + '65';
        }

        ctx.fillText(text, xPosition, yPosition);

        if (yPosition > canvas.height && Math.random() > 0.985) {
          rainDrops[i] = 0;
        }
        
        rainDrops[i] += isCalibrating ? 1.8 : 0.35; 
      }
    };

    animationFrameId = requestAnimationFrame(drawMatrix);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, activeTheme.fillColor, isCalibrating]);

  if (!mounted) return null;

  const handleExploreClick = () => {
    setIsCalibrating(true);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: "easeOut" }
  } as const;

  return (
    <>
      <ThemeSelector />

      {/* Main layout container remains fixed to keep canvas background static if needed, 
          or we can put AnimatePresence inside it to fade the contents */}
      <div className="w-screen min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden relative select-none selection:bg-slate-200">
        
        {/* TECHNICAL RAINFALL LAYER */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none opacity-[0.7] z-0 mix-blend-multiply"
        />

        {/* ================= LOADING SCREEN TYPING LAYER INTERCEPTOR ================= */}
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
                    style={{ backgroundImage: activeTheme.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {terminalText}
                    <span className="animate-pulse font-light ml-0.5 selection:bg-transparent" style={{ WebkitTextFillColor: 'initial', color: activeTheme.fillColor }}>|</span>
                  </h2>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= GLOBAL THEME FADE-CROSS OVERLAY CONTAINER ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`theme-content-${activeTheme.name}`}
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full min-h-screen relative flex flex-col justify-between z-20"
          >
            {/* BACKGROUND CHASSIS (HOROLOGY AESTHETIC) tied inside the fade block */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center z-0">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: isCalibrating ? 2.5 : 80, repeat: Infinity, ease: "linear" }}
                className="absolute w-[90vw] h-[90vw] max-w-[1100px] max-h-[1100px] border border-dashed rounded-full opacity-[0.04]"
                style={{ borderColor: activeTheme.fillColor, willChange: 'transform' }}
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: isCalibrating ? 1.8 : 50, repeat: Infinity, ease: "linear" }}
                className="absolute w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] border-2 border-dashed rounded-full opacity-[0.03] flex items-center justify-center"
                style={{ borderColor: activeTheme.fillColor, willChange: 'transform' }}
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

            {/* FAUX-TECHNICAL OVERLAY STAMPS */}
            <div className="hidden md:block absolute top-8 left-8 font-mono text-[10px] text-slate-400/80 tracking-widest z-40">
              SYSTEM THEME: {activeTheme.name.toUpperCase()}
            </div>
            <div className="hidden md:block absolute top-8 right-8 font-mono text-[10px] text-slate-400/80 tracking-widest z-40">
              WELCOME!
            </div>

            {/* ================= PRIMARY HERO CONTENT ================= */}
            <motion.div
              animate={isCalibrating ? { opacity: 0, scale: 0.98, filter: "blur(4px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative w-full z-20 grow flex items-center"
            >
              <section className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
                  
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-md shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       Available for Opportunities
                    </span>
                  </div>

                  {/* Main Headline */}
                  <motion.div {...fadeInUp} className="space-y-4">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
                      <span className="block font-sans text-slate-900">Software Engineer</span>
                      <span 
                        className="block bg-clip-text text-transparent transition-all duration-500 selection:text-slate-900"
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

                  {/* Subheadline */}
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-sans"
                  >
                    Specializing in cybersecurity, distributed systems, and AI-driven infrastructure. Dedicated to building secure, fault-tolerant mechanics that bridge raw power with luxury refinement.
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
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
              </section>
            </motion.div>

            {/* FOOTER */}
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