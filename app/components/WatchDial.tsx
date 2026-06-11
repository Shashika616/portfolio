"use client";

import React from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import { Section } from '../types';
import { useGlobalTheme } from '../context/ThemeContext';

interface WatchDialProps {
  sections: Section[];
  currentIndex: number;
  watchHandTransform: MotionValue<string>;
  structuralGearRotation: MotionValue<string>;
  jumpToSection: (index: number) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WatchDialComponent({
  sections,
  currentIndex,
  watchHandTransform,
  structuralGearRotation,
  jumpToSection,
  isSidebarOpen,
  setIsSidebarOpen
}: WatchDialProps) {
  const { activeTheme } = useGlobalTheme();

  const handleSectionClick = (index: number) => {
    jumpToSection(index);
    setIsSidebarOpen(false);
  };

  // Reusable drop-shadow object for the vector watch-pointer arrows
  const pointerGlowStyle = {
    filter: `drop-shadow(0 0 8px ${activeTheme.fillColor || '#3b82f6'}cc)`,
    transition: 'filter 0.4s ease-in-out, fill 0.4s ease-in-out'
  };

  return (
    <>
      {/* ================= FLOATING MENU TRIGGER (Mobile/Tablet Only) ================= */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsSidebarOpen(!isSidebarOpen);
        }}
        style={{ 
          backgroundImage: activeTheme.gradient,
          boxShadow: `0 4px 20px ${(activeTheme.fillColor || '#3b82f6')}50`
        }}
        className={`lg:hidden fixed top-7 left-5 z-[10001] p-3 rounded-xl text-white flex items-center justify-center border-none cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] transition-all duration-200 ease-in-out ${
          isSidebarOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 pointer-events-auto scale-100'
        }`}
        aria-label="Toggle navigation menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </button>

      {/* ================= MOBILE/TABLET SLIDABLE SIDEBAR ================= */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-[10000] flex pointer-events-none">
            {/* Backdrop Dimmer Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs pointer-events-auto"
            />

            {/* Sliding Drawer Chassis */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-[280px] sm:w-[320px] h-full bg-white border-r border-slate-200 shadow-2xl flex flex-col justify-center overflow-hidden px-4 pointer-events-auto"
            >
              {/* SIDEBAR HEADER CONTAINER */}
              <div className="absolute top-8 left-6 right-6 flex items-center justify-between z-20">
                {/* BRANDING HEADER TAG */}
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTheme.accentColor}`} />
                  <span className="font-mono text-[10px] font-bold text-slate-400 tracking-widest uppercase">Navigation</span>
                </div>

                {/* INTERNAL CLOSE BUTTON (Top Right) */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-colors cursor-pointer border-none bg-transparent flex items-center justify-center focus:outline-none touch-manipulation"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* INTEGRATED PERSISTENT GHOST WATCH MECHANISM */}
              <div className="relative w-full aspect-square flex items-center justify-center mt-8">
                
                {/* Embedded Fully Interactive Chronograph Backing Chassis */}
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[26rem] h-[26rem] flex items-center justify-center rounded-full bg-gradient-to-br from-slate-50 to-slate-100/40 border border-slate-200/60 opacity-30 pointer-events-none select-none will-change-transform transition-shadow duration-500"
                  style={{ 
                    boxShadow: `inset 0 0 40px ${(activeTheme.fillColor || '#3b82f6')}20, 0 10px 30px rgba(0,0,0,0.03)` 
                  }}
                >
                  <div className="absolute w-[94%] h-[94%] rounded-full bg-white/80 flex items-center justify-center overflow-hidden">
                    
                    {/* Animated Escapement Gear */}
                    <motion.div style={{ transform: structuralGearRotation }} className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 animate-[spin_30s_linear_infinite]" />
                    </motion.div>

                    {/* Chronograph Instrument Dial Scaled Vector */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                      <circle cx="100" cy="100" r="92" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />
                      <circle cx="100" cy="100" r="88" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="0.3 1.5" />
                      <circle cx="100" cy="100" r="68" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />

                      {[...Array(60)].map((_, i) => {
                        const angle = i * 6;
                        const rad = (angle - 90) * (Math.PI / 180);
                        const isMajor = i % 5 === 0;   
                        const tickLength = isMajor ? 8 : 4;
                        const rOuter = 92;
                        const rInner = rOuter - tickLength;

                        return (
                          <line 
                            key={i} 
                            x1={(100 + rOuter * Math.cos(rad)).toFixed(2)} 
                            y1={(100 + rOuter * Math.sin(rad)).toFixed(2)} 
                            x2={(100 + rInner * Math.cos(rad)).toFixed(2)} 
                            y2={(100 + rInner * Math.sin(rad)).toFixed(2)} 
                            stroke={isMajor ? "#475569" : "#cbd5e1"} 
                            strokeWidth={isMajor ? "0.75" : "0.5"} 
                          />
                        );
                      })}
                    </svg>

                    {/* Real-time Tracking Chronograph Watch Hand */}
                    <motion.div 
                      style={{ transform: watchHandTransform }}
                      className="absolute top-1/2 left-1/2 w-[125px] h-[1.5px] bg-slate-700 origin-left z-20 will-change-transform"
                    >
                      <svg className="absolute right-0 -top-[4px] w-2.5 h-2.5" viewBox="0 0 12 12">
                        <path 
                          d="M2 1 L10 6 L2 11 Z" 
                          fill={activeTheme.fillColor || "#3b82f6"} 
                          style={pointerGlowStyle}
                        />
                      </svg>
                    </motion.div>

                    {/* Mechanical Core Cap */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-100 border border-slate-300 shadow-xs flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-slate-800" />
                    </div>

                  </div>
                </div>

                {/* Vertical Navigation Link Stack Layer */}
                <div className="flex flex-col gap-6 w-full pl-8 relative z-10">
                  {sections.map((sec, index) => {
                    const isCurrent = currentIndex === index;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleSectionClick(index)}
                        className="flex items-center gap-4 py-1 group text-left focus:outline-none cursor-pointer touch-manipulation"
                      >
                        <span 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isCurrent ? 'w-6 shadow-xs' : 'bg-slate-300/80 w-2 group-hover:bg-slate-400'
                          }`}
                          style={isCurrent ? { 
                            backgroundImage: activeTheme.gradient,
                            boxShadow: `0 0 10px ${activeTheme.fillColor || '#3b82f6'}80`
                          } : {}}
                        />
                        <div className="flex flex-col">
                          <span className={`font-mono text-[9px] font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                            0{index + 1}
                          </span>
                          <span className={`text-[16px] uppercase tracking-wider font-sans mt-0.5 transition-all duration-200 ${
                            isCurrent ? 'text-slate-950 font-black' : 'text-slate-400 font-medium group-hover:text-slate-700'
                          }`}>
                            {sec.title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================================= */}
      {/* ================= DESKTOP ENGINE (Untouched Persistent Layout) ================= */}
      {/* ============================================================================= */}
      <div 
        className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[28rem] h-[28rem] items-center justify-center rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-white border border-slate-300 pointer-events-auto z-50 transition-all duration-500 ease-in-out"
        style={{ 
          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.8), 0 25px 60px rgba(100,116,139,0.15), 0 0 50px ${(activeTheme.fillColor || '#3b82f6')}15` 
        }}
      >
        <div className="absolute w-[96%] h-[96%] rounded-full bg-gradient-to-br from-slate-200 via-slate-50 to-slate-100 shadow-[inset_0_3px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <div 
            className="absolute w-[94%] h-[94%] rounded-full bg-white border border-slate-200/40 flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out"
            style={{ 
              boxShadow: `inset 0 0 35px ${(activeTheme.fillColor || '#3b82f6')}12` 
            }}
          >
            
            {/* ESCAPEMENT CONTROLS */}
            <motion.div style={{ transform: structuralGearRotation }} className="absolute top-1/3 left-1/3 w-14 h-14 rounded-full border border-slate-100 bg-[#fafcfd] shadow-[inset_0_2px_5px_rgba(0,0,0,0.04)] flex items-center justify-center opacity-40">
              <div className="w-10 h-10 rounded-full border border-dashed border-slate-200/80 flex items-center justify-center animate-[spin_40s_linear_infinite]">
                <div className="w-4 h-[0.5px] bg-slate-300" />
              </div>
            </motion.div>

            {/* CHRONOGRAPH INSTRUMENT DIALS */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="92" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="0.3 1.2" />
              <circle cx="100" cy="100" r="68" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />

              {[...Array(120)].map((_, i) => {
                const angle = i * 3;
                if (angle < 0 || angle > 180) return null; 
                const rad = (angle - 90) * (Math.PI / 180);
                const isMajor = i % 10 === 0;   
                const isMedium = i % 5 === 0 && !isMajor;

                const tickLength = isMajor ? 9 : isMedium ? 6 : 4;
                const rOuter = 92;
                const rInner = rOuter - tickLength;

                return (
                  <line 
                    key={i} 
                    x1={(100 + rOuter * Math.cos(rad)).toFixed(2)} 
                    y1={(100 + rOuter * Math.sin(rad)).toFixed(2)} 
                    x2={(100 + rInner * Math.cos(rad)).toFixed(2)} 
                    y2={(100 + rInner * Math.sin(rad)).toFixed(2)} 
                    stroke={isMajor ? "#334155" : isMedium ? "#64748b" : "#cbd5e1"} 
                    strokeWidth={isMajor ? "1" : "0.5"} 
                  />
                );
              })}
            </svg>

            {/* DYNAMIC CHRONOGRAPH ARMATURE CHASSIS */}
            <motion.div 
              style={{ transform: watchHandTransform }}
              className="absolute top-1/2 left-1/2 w-[140px] h-[2px] bg-slate-800 origin-left z-20 will-change-transform shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
            >
              <svg className="absolute right-0 -top-[5px] w-3 h-3" viewBox="0 0 12 12">
                <path 
                  d="M2 1 L10 6 L2 11 Z" 
                  fill={activeTheme.fillColor || "#3b82f6"} 
                  style={pointerGlowStyle}
                />
              </svg>
            </motion.div>

            {/* CENTER CAP HUB WITH GLOW AURA */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-slate-200 via-white to-slate-100 z-30 border border-slate-300 flex items-center justify-center transition-all duration-500"
              style={{ 
                boxShadow: `0 0 15px ${(activeTheme.fillColor || '#3b82f6')}50, 0 2px 5px rgba(0,0,0,0.15)` 
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

          </div>
        </div>

        {/* FLYBACK LINKS */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none">
          {sections.map((sec, index) => {
            const isCurrent = currentIndex === index;
            const spreadArcDegree = -55 + (index * 22); 
            const rad = spreadArcDegree * (Math.PI / 180);
            const radiusDistance = 235; 
            
            const x = (radiusDistance * Math.cos(rad)).toFixed(2);
            const y = (radiusDistance * Math.sin(rad)).toFixed(2);

            return (
              <button
                key={sec.id}
                onClick={() => handleSectionClick(index)}
                className="absolute pointer-events-auto flex items-center gap-2.5 group whitespace-nowrap focus:outline-none cursor-pointer"
                style={{ transform: `translate3d(${x}px, ${y}px, 0) translateY(-50%)` }}
              >
                <span 
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    isCurrent ? 'w-5 shadow-[0_1px_4px_rgba(0,0,0,0.15)]' : 'bg-slate-300 w-2 group-hover:bg-slate-400'
                  }`}
                  style={isCurrent ? { 
                    backgroundImage: activeTheme.gradient,
                    boxShadow: `0 0 12px ${activeTheme.fillColor || '#3b82f6'}cc`
                  } : {}}
                />

                <div className="flex flex-col items-start text-left leading-none bg-white/60 backdrop-blur-xs px-1.5 py-0.5 rounded">
                  <span 
                    className="font-mono text-[9px] tracking-tight font-bold transition-all duration-200"
                    style={isCurrent ? { 
                      color: activeTheme.fillColor || '#3b82f6'
                    } : { 
                      color: '#94a3b8' 
                    }}
                  >
                    0{index + 1}
                  </span>
                  <span className={`text-[13px] tracking-wider uppercase font-sans mt-0.5 transition-all duration-200 ${
                    isCurrent ? 'text-slate-950 font-extrabold scale-[1.02]' : 'text-slate-400 font-medium group-hover:text-slate-600'
                  }`}>
                    {sec.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}